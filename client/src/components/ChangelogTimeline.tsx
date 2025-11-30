import ChangelogEntry from "./ChangelogEntry";
import type { ChangelogEntry as ChangelogEntryType } from "@shared/schema";

interface ChangelogTimelineProps {
  entries: ChangelogEntryType[];
}

export default function ChangelogTimeline({ entries }: ChangelogTimelineProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="changelog-empty">
        <p className="text-lg text-muted-foreground">No updates yet. Stay tuned!</p>
      </div>
    );
  }

  return (
    <div className="space-y-0" data-testid="changelog-timeline">
      {entries.map((entry, index) => (
        <ChangelogEntry key={entry.version} entry={entry} isLatest={index === 0} />
      ))}
    </div>
  );
}
