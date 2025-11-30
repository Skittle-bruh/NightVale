import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import ChangelogTimeline from "@/components/ChangelogTimeline";
import DiscordWidget from "@/components/DiscordWidget";
import type { ChangelogEntry } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Changelog() {
  const { data: entries, isLoading } = useQuery<ChangelogEntry[]>({
    queryKey: ["/api/changelog"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header projectName="NightVale" />

      <div className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
          <div className="absolute top-[300px] right-0 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-pink-500/10 to-fuchsia-500/10 blur-3xl" />
        </div>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="mb-8 sm:mb-12 text-center">
            <h1
              className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              data-testid="text-page-title"
            >
              Changelog
            </h1>
            <p className="mt-2 text-muted-foreground" data-testid="text-page-subtitle">
              All the latest updates, improvements, and fixes.
            </p>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-8">
                      <div className="hidden sm:flex flex-col items-center">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="w-0.5 flex-1 mt-2" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ChangelogTimeline entries={entries || []} />
              )}
            </div>

            <aside className="lg:w-80 lg:flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <DiscordWidget
                  serverId={import.meta.env.VITE_DISCORD_SERVER_ID}
                  inviteLink={import.meta.env.VITE_DISCORD_INVITE_URL || "https://discord.gg/your-invite"}
                />
              </div>
            </aside>
          </div>
        </main>
      </div>

      <footer className="border-t border-border py-6 mt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Made with care by the NightVale team
          </p>
        </div>
      </footer>
    </div>
  );
}
