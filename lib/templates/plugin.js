import Vue from "vue";

const plugin = {
  install(Vue) {
    const component = require("./component.js");
    Vue.component(
      "<%= options.componentName %>",
      component.default || component
    );

    Vue.mixin({
      beforeCreate() {
        if (
          this.$options.editThisPage &&
          typeof this.$options.editThisPage.resolve === "function"
        ) {
          this.$editThisPageStore.override = this.$options.editThisPage.resolve(
            {
              route: this.$route,
            }
          );
        }
      },
    });
  },
};

export default ({ app }, inject) => {
  Vue.use(plugin);

  const editThisPageStore = Vue.observable({ override: "" });
  inject("editThisPageStore", editThisPageStore);

  app.router.beforeHooks.push((_to, _from, next) => {
    editThisPageStore.override = "";
    next();
  });
};
