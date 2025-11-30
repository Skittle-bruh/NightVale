import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertChangelogEntrySchema, type ChangelogEntry, type ChangeItem } from "@shared/schema";
import { Plus, Trash2, Edit, Lock, ArrowLeft, X } from "lucide-react";
import { z } from "zod";

const adminKeySchema = z.object({
  key: z.string().min(1, "Admin key is required"),
});

export default function Admin() {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ChangelogEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const keyForm = useForm<z.infer<typeof adminKeySchema>>({
    resolver: zodResolver(adminKeySchema),
    defaultValues: { key: "" },
  });

  useEffect(() => {
    const storedKey = sessionStorage.getItem("adminKey");
    if (storedKey) {
      setAdminKey(storedKey);
      setIsAuthenticated(true);
    }
  }, []);

  const { data: entries, isLoading } = useQuery<ChangelogEntry[]>({
    queryKey: ["/api/changelog"],
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: async (data: ChangelogEntry) => {
      const res = await fetch("/api/admin/changelog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey || "",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create entry");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/changelog"] });
      toast({ title: "Entry created successfully" });
      setIsDialogOpen(false);
      setEditingEntry(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ version, data }: { version: string; data: ChangelogEntry }) => {
      const res = await fetch(`/api/admin/changelog/${version}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey || "",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update entry");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/changelog"] });
      toast({ title: "Entry updated successfully" });
      setIsDialogOpen(false);
      setEditingEntry(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (version: string) => {
      const res = await fetch(`/api/admin/changelog/${version}`, {
        method: "DELETE",
        headers: {
          "x-admin-key": adminKey || "",
        },
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete entry");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/changelog"] });
      toast({ title: "Entry deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleLogin = (data: z.infer<typeof adminKeySchema>) => {
    sessionStorage.setItem("adminKey", data.key);
    setAdminKey(data.key);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminKey");
    setAdminKey(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-pink-500/20">
              <Lock className="h-6 w-6 text-violet-400" />
            </div>
            <CardTitle>Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...keyForm}>
              <form onSubmit={keyForm.handleSubmit(handleLogin)} className="space-y-4">
                <FormField
                  control={keyForm.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Key</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter admin key..."
                          data-testid="input-admin-key"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" data-testid="button-login">
                  Access Admin Panel
                </Button>
              </form>
            </Form>
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => setLocation("/")}
              data-testid="button-back"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Changelog
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-4 px-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setLocation("/")} data-testid="button-view-changelog">
              View Changelog
            </Button>
            <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">Changelog Entries</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setEditingEntry(null)}
                data-testid="button-add-entry"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingEntry ? "Edit Entry" : "Add New Entry"}
                </DialogTitle>
              </DialogHeader>
              <EntryForm
                entry={editingEntry}
                onSubmit={(data) => {
                  if (editingEntry) {
                    updateMutation.mutate({ version: editingEntry.version, data });
                  } else {
                    createMutation.mutate(data);
                  }
                }}
                isPending={createMutation.isPending || updateMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : entries?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No entries yet. Add your first changelog entry!
          </div>
        ) : (
          <div className="space-y-4">
            {entries?.map((entry) => (
              <Card key={entry.version} className="overflow-visible">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-violet-400">
                          v{entry.version}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {entry.date}
                        </span>
                      </div>
                      <h3 className="font-semibold mt-1">{entry.title}</h3>
                      {entry.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {entry.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.changes.map((change, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {change.category}: {change.text.slice(0, 30)}
                            {change.text.length > 30 ? "..." : ""}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditingEntry(entry);
                          setIsDialogOpen(true);
                        }}
                        data-testid={`button-edit-${entry.version}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(entry.version)}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-${entry.version}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

interface EntryFormProps {
  entry: ChangelogEntry | null;
  onSubmit: (data: ChangelogEntry) => void;
  isPending: boolean;
}

function EntryForm({ entry, onSubmit, isPending }: EntryFormProps) {
  const [changes, setChanges] = useState<ChangeItem[]>(
    entry?.changes || [{ text: "", category: "feature" }]
  );

  const form = useForm({
    resolver: zodResolver(insertChangelogEntrySchema.omit({ changes: true })),
    defaultValues: {
      version: entry?.version || "",
      date: entry?.date || new Date().toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      }),
      title: entry?.title || "",
      description: entry?.description || "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    const validChanges = changes.filter(c => c.text.trim() !== "");
    if (validChanges.length === 0) {
      return;
    }
    onSubmit({ ...data, changes: validChanges });
  });

  const addChange = () => {
    setChanges([...changes, { text: "", category: "feature" }]);
  };

  const removeChange = (index: number) => {
    setChanges(changes.filter((_, i) => i !== index));
  };

  const updateChange = (index: number, field: keyof ChangeItem, value: string) => {
    const newChanges = [...changes];
    newChanges[index] = { ...newChanges[index], [field]: value };
    setChanges(newChanges);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Version</FormLabel>
                <FormControl>
                  <Input placeholder="2.4.0" data-testid="input-version" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input placeholder="December 1, 2025" data-testid="input-date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Major Update" data-testid="input-title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of this update..."
                  data-testid="input-description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FormLabel>Changes</FormLabel>
            <Button type="button" variant="outline" size="sm" onClick={addChange}>
              <Plus className="mr-1 h-3 w-3" />
              Add
            </Button>
          </div>
          {changes.map((change, index) => (
            <div key={index} className="flex gap-2">
              <Select
                value={change.category}
                onValueChange={(v) => updateChange(index, "category", v)}
              >
                <SelectTrigger className="w-32" data-testid={`select-category-${index}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature">New</SelectItem>
                  <SelectItem value="improvement">Improved</SelectItem>
                  <SelectItem value="fix">Fixed</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={change.text}
                onChange={(e) => updateChange(index, "text", e.target.value)}
                placeholder="Change description..."
                className="flex-1"
                data-testid={`input-change-${index}`}
              />
              {changes.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeChange(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button type="submit" className="w-full" disabled={isPending} data-testid="button-submit">
          {isPending ? "Saving..." : entry ? "Update Entry" : "Create Entry"}
        </Button>
      </form>
    </Form>
  );
}
