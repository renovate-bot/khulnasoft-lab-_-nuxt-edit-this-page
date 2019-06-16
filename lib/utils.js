import { ROUTE_META_KEY } from './constants';

const { join } = require('path');

export const isNull = val => val === null;

export const extendRoutes = routes => {
  const recurse = children =>
    children.map(child => {
      const meta = child.meta || {};
      meta[ROUTE_META_KEY] = `${child.chunkName}.vue`;
      const route = {
        ...child,
        meta,
      };
      if (child.children) {
        route.children = recurse(child.children);
      }
      return route;
    });

  return recurse(routes);
};

const isSsh = repo => /^git@/.test(repo);

const getRepoUrl = repo => {
  let baseLink = repo;
  if (isSsh(repo)) {
    baseLink = baseLink.substring(4);
    baseLink = baseLink.replace(/:/, '/');
  }
  baseLink = baseLink.replace(/\.git$/, '');
  baseLink = baseLink.replace(/\/+$/, '');
  if (!/^https:\/\//.test(baseLink)) {
    baseLink = `https://${baseLink}`;
  }
  return baseLink;
};

export const getEditUrl = (repo, branch) => {
  const repoUrl = getRepoUrl(repo);
  return join(repoUrl, 'edit', branch);
};
