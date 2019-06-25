export const MODULE_NAME = "nuxt-edit-this-page";
export const TEMPLATES_DIR = "edit-this-page";
export const OPTIONS_KEY = "editThisPage";
export const ROUTE_META_KEY = "editFilePath";
export const ROUTE_META_OVERRIDE_KEY = `${ROUTE_META_KEY}Override`;

export const DEFAULT_OPTIONS = {
  repo: null,
  path: 'blob',
  branch: "master",
  linkText: "Edit this page",
  componentName: "EditThisPageLink"
};
