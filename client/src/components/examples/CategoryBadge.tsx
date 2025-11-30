import CategoryBadge from "../CategoryBadge";

export default function CategoryBadgeExample() {
  return (
    <div className="flex flex-wrap gap-3">
      <CategoryBadge category="feature" />
      <CategoryBadge category="improvement" />
      <CategoryBadge category="fix" />
    </div>
  );
}
