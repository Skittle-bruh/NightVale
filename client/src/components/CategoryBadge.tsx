import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Wrench } from "lucide-react";
import type { CategoryType } from "@shared/schema";

interface CategoryBadgeProps {
  category: CategoryType;
}

const categoryConfig: Record<
  CategoryType,
  { label: string; icon: typeof Sparkles; className: string }
> = {
  feature: {
    label: "New",
    icon: Sparkles,
    className: "bg-gradient-to-r from-violet-500 to-purple-500 text-white border-transparent",
  },
  improvement: {
    label: "Improved",
    icon: Zap,
    className: "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-transparent",
  },
  fix: {
    label: "Fixed",
    icon: Wrench,
    className: "bg-secondary text-secondary-foreground",
  },
};

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <Badge
      className={`${config.className} flex items-center gap-1 text-xs font-medium`}
      data-testid={`badge-category-${category}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
