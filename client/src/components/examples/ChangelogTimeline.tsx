import ChangelogTimeline from "../ChangelogTimeline";

const mockEntries = [
  {
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
  },
  {
    version: "2.0.0",
    date: "November 15, 2025",
    title: "Major Redesign",
    description: "Complete UI overhaul with new components.",
    changes: [
      { text: "New dashboard layout", category: "feature" as const },
      { text: "Better accessibility", category: "improvement" as const },
      { text: "Login issues", category: "fix" as const },
    ],
  },
];

export default function ChangelogTimelineExample() {
  return <ChangelogTimeline entries={mockEntries} />;
}
