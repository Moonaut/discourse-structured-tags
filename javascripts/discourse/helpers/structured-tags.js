import { helper } from "@ember/component/helper";

const PRIORITY = ["status:confirmed", "status:needs-testing", "status:fixed"];
const MAX_VISIBLE = 3;

export default helper(function structuredTags([tags]) {
  if (!tags?.length) return { visible: [], hidden: [] };

  // Sort: priority tags first, then others
  const sorted = [...tags].sort((a, b) => {
    const ai = PRIORITY.indexOf(a.name);
    const bi = PRIORITY.indexOf(b.name);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return 0;
  });

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
