import { helper } from "@ember/component/helper";

export default helper(function tagDisplayName([name]) {
  if (name?.startsWith("milestone:")) {
    return name.replaceAll("_", ".");
  }
  return name;
});
