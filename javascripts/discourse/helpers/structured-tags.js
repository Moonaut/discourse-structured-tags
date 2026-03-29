import { helper } from "@ember/component/helper";

const PRIORITY_TAGS = [
  "status:confirmed",
  "status:needs-testing",
  "status:fixed",
];

const PRIORITY_PREFIXES = ["status", "milestone", "in", "about"];
const MAX_VISIBLE = 3;

function isVersionTag(name) {
  if (!name) return false;

  return (
    /^(alpha|beta|rc)-\d+(?:-\d+)*$/.test(name) || // alpha-1-2-2 / beta-1-2-3 / rc-1-3-4
    /^\d+(?:-\d+)+$/.test(name)                    // 1-2 / 1-3-5 / 1-0
  );
}

function tagName(tag) {
  return typeof tag === "string" ? tag : tag?.name;
}

function tagGroupKey(name) {
  if (!name) return null;

  if (name.includes(":")) {
    return name.split(":")[0];
  }

  if (isVersionTag(name)) {
    return "milestone";
  }

  return name;
}

function tagSortKey(name) {
  if (!name) return PRIORITY_TAGS.length + PRIORITY_PREFIXES.length;

  const exactIndex = PRIORITY_TAGS.indexOf(name);
  if (exactIndex !== -1) return exactIndex;

  const prefix = tagGroupKey(name);
  const prefixIndex = PRIORITY_PREFIXES.indexOf(prefix);

  return prefixIndex !== -1
    ? PRIORITY_TAGS.length + prefixIndex
    : PRIORITY_TAGS.length + PRIORITY_PREFIXES.length;
}

function decorateTag(tag) {
  const name = tagName(tag);
  const classes = [];

  if (isVersionTag(name)) {
    classes.push("milestone");
  }

  return {
    original: tag,
    name,
    classes,
    className: classes.join(" "),
  };
}

export default helper(function structuredTags([tags]) {
  if (!tags?.length) return null;

  const sorted = [...tags].sort((a, b) => {
    return tagSortKey(tagName(a)) - tagSortKey(tagName(b));
  });

  const seen = new Set();

  const deduped = sorted.filter((tag) => {
    const name = tagName(tag);
    if (!name) return false;

    const key = tagGroupKey(name);
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });

  const decorated = deduped.map(decorateTag);

  return {
    visible: decorated.slice(0, MAX_VISIBLE),
    hidden: decorated.slice(MAX_VISIBLE),
  };
});