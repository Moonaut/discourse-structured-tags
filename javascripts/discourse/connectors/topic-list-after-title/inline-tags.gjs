import Component from "@glimmer/component";

export default class InlineTopicTags extends Component {
  get hiddenPrefixes() {
    return (settings.hide_from_topics_list_prefixes || [])
      .map((prefix) => prefix?.trim().toLowerCase())
      .filter(Boolean);
  }

  tagName(tag) {
    return typeof tag === "string" ? tag : tag?.name;
  }

  shouldShowTag(tag) {
    const name = this.tagName(tag);

    if (!name) {
      return false;
    }

    return !this.hiddenPrefixes.some((prefix) =>
      name.toLowerCase().startsWith(prefix)
    );
  }

  get visibleTags() {
    return (this.args.topic?.tags || []).filter((tag) => this.shouldShowTag(tag));
  }

  toggleHidden(event) {
    const toggle = event.target;
    const extraTags = toggle?.nextElementSibling;

    if (extraTags) {
      extraTags.hidden = !extraTags.hidden;
    }
  }

  <template>
    <span class="inline-topic-tags">
      
        href={{concat "/t/" @topic.slug "/" @topic.id "/1"}}
        data-topic-id={{@topic.id}}
        class="title raw-link raw-topic-link inline-topic-title-link"
      >
        {{@topic.title}}
      </a>

      {{#if this.visibleTags.length}}
        {{#let (structured-tags this.visibleTags) as |s|}}
          {{#each s.visible as |tag|}}
            
              href={{concat "/tag/" (this.tagName tag)}}
              class="discourse-tag box"
              data-tag-name={{this.tagName tag}}
            >
              {{tag-display-name (this.tagName tag)}}
            </a>
          {{/each}}

          {{#if s.hidden.length}}
            <span
              class="discourse-tag box extra-tags-toggle"
              role="button"
              {{on "click" this.toggleHidden}}
            >
              +{{s.hidden.length}}
            </span>

            <span class="extra-tags" hidden>
              {{#each s.hidden as |tag|}}
                
                  href={{concat "/tag/" (this.tagName tag)}}
                  class="discourse-tag box"
                  data-tag-name={{this.tagName tag}}
                >
                  {{tag-display-name (this.tagName tag)}}
                </a>
              {{/each}}
            </span>
          {{/if}}
        {{/let}}
      {{/if}}
    </span>
  </template>
}