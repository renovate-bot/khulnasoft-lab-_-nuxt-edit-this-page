import {
  MODULE_NAME,
  DEFAULT_OPTIONS,
  OPTIONS_KEY,
  TEMPLATES_DIR,
  ROUTE_META_KEY,
  ROUTE_META_OVERRIDE_KEY
} from "./constants";
import { isNull, extendRoutes, getEditUrl } from "./utils";

const path = require("path");

module.exports = async function module(moduleOptions) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...this.options[OPTIONS_KEY],
    ...moduleOptions
  };

  if (isNull(options.repo)) {
    throw new Error(`[${MODULE_NAME}] Please set the repo option`);
  }

  this.extendRoutes(extendRoutes);

  const editUrl = getEditUrl(options.repo, options.path, options.branch);
  const { srcDir, rootDir } = this.options;

  const templatesOptions = {
    ...options,
    editUrl,
    srcDir: srcDir !== rootDir ? srcDir : "",
    routeMetaKey: ROUTE_META_KEY,
    routeMetaKeyOverride: ROUTE_META_OVERRIDE_KEY
  };

  this.addPlugin({
    src: path.resolve(__dirname, "templates/plugin.js"),
    fileName: path.join(TEMPLATES_DIR, "plugin.js"),
    options: templatesOptions
  });

  this.addTemplate({
    src: path.resolve(__dirname, "templates/component.js"),
    fileName: path.join(TEMPLATES_DIR, "component.js"),
    options: templatesOptions
  });
};
module.exports.meta = require("../package.json");
