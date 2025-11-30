import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CategoryBadge from "./CategoryBadge";
import { Check } from "lucide-react";
import type { ChangelogEntry as ChangelogEntryType, CategoryType } from "@shared/schema";

interface ChangelogEntryProps {
  entry: ChangelogEntryType;
  isLatest?: boolean;
}

export default function ChangelogEntry({ entry, isLatest = false }: ChangelogEntryProps) {
  const groupedChanges = entry.changes.reduce(
    (acc, change) => {
      if (!acc[change.category]) {
        acc[change.category] = [];
      }
      acc[change.category].push(change.text);
      return acc;
    },
    {} as Record<CategoryType, string[]>
  );

  const categoryOrder: CategoryType[] = ["feature", "improvement", "fix"];

  return (
    <div className="relative flex gap-4 sm:gap-8" data-testid={`changelog-entry-${entry.version}`}>
      <div className="hidden sm:flex flex-col items-center">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            isLatest
              ? "bg-gradient-to-br from-violet-500 to-pink-500"
              : "bg-gradient-to-br from-violet-500/30 to-pink-500/30"
          }`}
        >
          <div
            className={`h-4 w-4 rounded-full ${
              isLatest ? "bg-white" : "bg-gradient-to-br from-violet-400 to-pink-400"
            }`}
          />
        </div>
        <div className="w-0.5 flex-1 bg-gradient-to-b from-violet-400/50 via-pink-400/30 to-transparent" />
      </div>

      <Card className="flex-1 mb-8 overflow-visible hover-elevate transition-all duration-300">
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4 pb-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-lg font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent"
                data-testid={`text-version-${entry.version}`}
              >
                v{entry.version}
              </span>
              {isLatest && (
                <span className="rounded-full bg-gradient-to-r from-violet-500 to-purple-500 px-2 py-0.5 text-xs font-medium text-white">
                  Latest
                </span>
              )}
            </div>
            <time className="text-sm text-muted-foreground" data-testid={`text-date-${entry.version}`}>
              {entry.date}
            </time>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-foreground" data-testid={`text-title-${entry.version}`}>
              {entry.title}
            </h3>
            {entry.description && (
              <p className="mt-1 text-muted-foreground leading-relaxed">{entry.description}</p>
            )}
          </div>

          <div className="space-y-4">
            {categoryOrder.map((category) => {
              const items = groupedChanges[category];
              if (!items || items.length === 0) return null;

              return (
                <div key={category} className="space-y-2">
                  <CategoryBadge category={category} />
                  <ul className="space-y-1.5 pl-1">
                    {items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-foreground/90"
                        data-testid={`text-change-item-${entry.version}-${idx}`}
                      >
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-400" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
