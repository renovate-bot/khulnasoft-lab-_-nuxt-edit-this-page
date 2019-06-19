# nuxt-edit-this-page

[![npm (scoped with tag)](https://img.shields.io/npm/v/@gitlab/nuxt-edit-this-page/latest.svg?style=flat-square)](https://npmjs.com/package/@gitlab/nuxt-edit-this-page)
[![npm](https://img.shields.io/npm/dt/@gitlab/nuxt-edit-this-page.svg?style=flat-square)](https://npmjs.com/package/@gitlab/nuxt-edit-this-page)

> Add an "Edit this page" link to your Nuxt pages

[📖 **Release Notes**](./CHANGELOG.md)

## Features

This module let's you add "Edit this page" links in your Nuxt project's pages. The link opens the web IDE for the active file, which is the page's Vue file by default but that can be changed as needed by using a custom path resolver.

## Supported Git services

- [GitLab](https://gitlab.com/)

## Setup

- Install the module with your favorite package manager.

```sh
yarn add @gitlab/nuxt-edit-this-page
# Or npm i @gitlab/nuxt-edit-this-page
```

- Add `@gitlab/nuxt-edit-this-page` to the `modules` section in `nuxt.config.js`.

```js
// nuxt.config.js
{
  modules: [
    '@gitlab/nuxt-edit-this-page',
 ],
}
```

- Configure the module as needed by adding an `editThisPage` key to `nuxt.config.js`.

```js
// nuxt.config.js
{
  editThisPage: {
    // Module options
  }
}
```

## Usage

When enabled, the module registers a global component that you can use to display an "Edit this page" link in any of your page. The component will automatically generate a link based on the route that's being visited so that you can quickly access the live editor on the Git hosting service.

```vue
<template>
  <edit-this-page-link />
</template>
```

The component accepts a few props to customize the ads you display.

## Options

### repo

- **Type**: `String`: required

The remote Git repository where the files reside, can be an HTTPS URL or an SSH address.

Example:

```js
// nuxt.config.js
{
  editThisPage: {
    repo: 'git@gitlab.com:gitlab-org/frontend/nuxt-edit-this-page.git',

    // Or
    // repo: 'https://gitlab.com/gitlab-org/frontend/nuxt-edit-this-page.git',

    // Also works with the project's URL
    // repo: 'https://gitlab.com/gitlab-org/frontend/nuxt-edit-this-page',
  }
}
```

### branch

- **Type**: `String`
- **Default**: `'master'`

Git branch to use when editing files.

### linkText

- **Type**: `String`
- **Default**: `'Edit this page'`

Text to show when rendering the link.

### componentName

- **Type**: `String`
- **Default**: `'EditThisPageLink'`

The component's name.

### Props

The component accepts a few props that let you override the module's options if needed.

#### editUrl

- Type: `String`

Base URL to prepend to the file path when generating the edit link. This is computed automatically based on the `repo` and `branch` options, use it when you need to override the URL on a case-per-case basis.

### linkText

- Type: `String`

Text to show when rendering the link. Defaults to the value set in the module's options.

### Custom path resolver

Sometimes, your pages display contents from other files and you might want the "Edit this page" link to point to the included file, rather than the visited page's component. This can be achieved by adding an `editThisPage.resolve` option to your page. `editThisPage.resolve` is a function that receives the current route and should return the computed file path relative to the repository's root.

Example:

```vue
<template>
  <!-- pages/_slug.vue -->
</template>

<script>
export default {
  editThisPage: {
    resolve({ route }) {
      const { slug } = route.params;
      return `docs/${slug}.md`;
    },
  },
};
</script>
```

## Development

- Clone this repository
- Install dependencies using `yarn install` or `npm install`
- Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) GitLab
