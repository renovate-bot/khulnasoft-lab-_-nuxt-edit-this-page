export default {
  name: "<%= options.componentName %>",
  props: {
    editUrl: {
      type: String,
      required: false,
      default: "<%= options.editUrl %>",
    },
    linkText: {
      type: String,
      required: false,
      default: "<%= options.linkText %>",
    },
  },
  computed: {
    href() {
      const path =
        this.$editThisPageStore.override ||
        this.$route.meta["<%= options.routeMetaKey %>"];
      return `${this.editUrl}/${path}`;
    },
  },
  render(h) {
    return h(
      "a",
      {
        attrs: {
          href: this.href,
          rel: "noopener nofollow",
          class: "edit-this-page-link",
        },
        scopedSlots: {
          default: function (props) {
            return h("span", props);
          },
        },
      },
      [
        this.$scopedSlots.default
          ? this.$scopedSlots.default({
              href: this.href,
            })
          : this.linkText,
      ]
    );
  },
};
