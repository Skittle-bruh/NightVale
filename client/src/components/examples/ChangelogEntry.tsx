import ChangelogEntry from "../ChangelogEntry";

export default function ChangelogEntryExample() {
  const sampleEntry = {
    version: "2.1.0",
    date: "November 28, 2025",
    title: "Performance Boost",
    description: "Major performance improvements and new collaboration features.",
    changes: [
      { text: "Real-time collaboration", category: "feature" as const },
      { text: "Dark mode support", category: "feature" as const },
      { text: "Faster page loads by 40%", category: "improvement" as const },
      { text: "Navigation lag on mobile", category: "fix" as const },
    ],
  };

  return <ChangelogEntry entry={sampleEntry} isLatest />;
}
