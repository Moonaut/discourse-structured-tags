import { helper } from "@ember/component/helper";

const PRIORITY_TAGS = [
	"status:confirmed",
	"status:needs-testing",
	"status:fixed",
];
const PRIORITY_PREFIXES = ["status", "milestone", "in", "about"];
const MAX_VISIBLE = 3;

function tagSortKey(name) {
	if (!name) return PRIORITY_TAGS.length + PRIORITY_PREFIXES.length;

	const exactIndex = PRIORITY_TAGS.indexOf(name);
	if (exactIndex !== -1) return exactIndex;

	const prefix = name.includes(":") ? name.split(":")[0] : name;
	const prefixIndex = PRIORITY_PREFIXES.indexOf(prefix);

	return prefixIndex !== -1
		? PRIORITY_TAGS.length + prefixIndex
		: PRIORITY_TAGS.length + PRIORITY_PREFIXES.length;
}

export default helper(function structuredTags([tags]) {
	if (!tags?.length) return null;

	const sorted = [...tags].sort((a, b) => {
		const nameA = typeof a === "string" ? a : a.name;
		const nameB = typeof b === "string" ? b : b.name;
		return tagSortKey(nameA) - tagSortKey(nameB);
	});

	const seen = new Set();
	const deduped = sorted.filter((tag) => {
		const name = typeof tag === "string" ? tag : tag.name;
		if (!name) return false;

		const prefix = name.includes(":") ? name.split(":")[0] : name;
		if (seen.has(prefix)) return false;

		seen.add(prefix);
		return true;
	});

	return {
		visible: deduped.slice(0, MAX_VISIBLE),
		hidden: deduped.slice(MAX_VISIBLE),
	};
});
