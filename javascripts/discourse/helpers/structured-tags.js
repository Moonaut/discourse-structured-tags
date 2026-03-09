import { helper } from "@ember/component/helper";

const PRIORITY_TAGS = ["status:confirmed", "status:needs-testing", "status:fixed"];
const PRIORITY_PREFIXES = ["status", "milestone", "in", "about"];
const MAX_VISIBLE = 3;

function tagSortKey(name) {
  // Exact priority tags get top spots (0, 1, 2)
  const exactIndex = PRIORITY_TAGS.indexOf(name);
  if (exactIndex !== -1) return exactIndex;

  // Then sort by prefix order, offset past the exact-match slots
  const prefix = name.includes(":") ? name.split(":")[0] : name;
  const prefixIndex = PRIORITY_PREFIXES.indexOf(prefix);
  return prefixIndex !== -1
    ? PRIORITY_TAGS.length + prefixIndex
    : PRIORITY_TAGS.length + PRIORITY_PREFIXES.length;
}

export default helper(function structuredTags([tags]) {
  if (!tags?.length) return { visible: [], hidden: [] };

  const sorted = [...tags].sort((a, b) => tagSortKey(a.name) - tagSortKey(b.name));

  // Deduplicate by prefix (keep first encountered per prefix)
  const seen = new Set();
  const deduped = sorted.filter((tag) => {
    const prefix = tag.name.includes(":") ? tag.name.split(":")[0] : tag.name;
    if (seen.has(prefix)) return false;
    seen.add(prefix);
    return true;
  });

  return {
    visible: deduped.slice(0, MAX_VISIBLE),
    hidden: deduped.slice(MAX_VISIBLE),
  };
});