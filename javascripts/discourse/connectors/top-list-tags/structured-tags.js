import Component from "@glimmer/component";
import { inject as service } from "@ember/service";

export default class StructuredTags extends Component {
  @service router;

  get structuredTags() {
    const topic = this.args.outletArgs?.topic || this.args.topic;

    if (!topic || !topic.tags) {
      return [];
    }

    return topic.tags.map((tag) => {
      let label = tag;
      let category = null;
      let value = tag;

      // Rule 1: Tags are written like category:value
      if (tag.includes(":")) {
        const parts = tag.split(":");
        category = parts[0];
        value = parts.slice(1).join(":"); // Join back if multiple colons exist

        // Rule 2: Milestone tags should have their hyphens into dots
        if (category === "milestone") {
          value = value.replace(/-/g, ".");
        }
        
        label = `${category}: ${value}`;
      } else {
        // Handle tags that don't follow the pattern if necessary
        category = "tag"; 
      }

      return {
        original: tag,
        category,
        value,
        label,
        url: `${this.router.rootURL}tag/${tag}`,
      };
    });
  }
}
