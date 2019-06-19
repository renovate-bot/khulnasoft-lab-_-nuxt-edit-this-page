const { resolve } = require('path');
const { argv } = require('yargs');

module.exports = (options = {}) => {
  const fixture = options.fixture || argv.fixture;
  let moduleConfig = {
    repo: 'git@gitlab.com:gitlab-org/frontend/nuxt-edit-this-page.git',
  };
  if (fixture === 'branch') {
    moduleConfig.branch = 'some-branch';
  } else if (fixture === 'incomplete-config') {
    moduleConfig = {};
  }

  return {
    rootDir: resolve(__dirname, '../..'),
    srcDir: __dirname,
    dev: false,
    render: {
      resourceHints: false,
    },
    modules: ['@@'],
    editThisPage: moduleConfig,
  };
};
