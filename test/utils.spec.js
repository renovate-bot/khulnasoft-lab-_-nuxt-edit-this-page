import { isNull, extendRoutes, getEditUrl } from '../lib/utils';
import { ROUTE_META_KEY } from '../lib/constants';

describe('isNull', () => {
  const nonNullValues = [undefined, 0, false, '', '0'];

  it('returns true when input is null', () => {
    expect(isNull(null)).toBe(true);
  });

  it.each(nonNullValues)('returns false when input is %s', value => {
    expect(isNull(value)).toBe(false);
  });
});

describe('extendRoutes', () => {
  const routesMock = [
    {
      chunkName: 'pages/index',
      children: [
        {
          chunkName: 'pages/child',
          meta: { foo: 'bar' },
          children: [
            {
              chunkName: 'pages/child/nested',
            },
          ],
        },
      ],
    },
  ];

  const expectedRoutes = [
    {
      chunkName: 'pages/index',
      meta: { [ROUTE_META_KEY]: 'pages/index.vue' },
      children: [
        {
          chunkName: 'pages/child',
          meta: { foo: 'bar', [ROUTE_META_KEY]: 'pages/child.vue' },
          children: [
            {
              chunkName: 'pages/child/nested',
              meta: { [ROUTE_META_KEY]: 'pages/child/nested.vue' },
            },
          ],
        },
      ],
    },
  ];

  it('adds proper meta on every route', () => {
    expect(extendRoutes(routesMock)).toEqual(expectedRoutes);
  });
});

describe('getEditUrl', () => {
  const repoOptionValidValues = [
    'git@gitlab.com:gitlab-org/frontend/nuxt-edit-this-page.git',
    'https://gitlab.com/gitlab-org/frontend/nuxt-edit-this-page.git',
    'https://gitlab.com/gitlab-org/frontend/nuxt-edit-this-page',
  ];
  it.each(repoOptionValidValues)('computes edit URL properly when repo option is %s', option => {
    expect(getEditUrl(option)).toBe(
      'https://gitlab.com/gitlab-org/frontend/nuxt-edit-this-page/blob/master',
    );
  });

  it.each(repoOptionValidValues)('computes edit URL properly when repo option is %s and path is edit', option => {
    expect(getEditUrl(option, 'edit')).toBe(
      'https://gitlab.com/gitlab-org/frontend/nuxt-edit-this-page/edit/master',
    );
  });

  it.each(repoOptionValidValues)('computes edit URL properly when repo option is %s and branch is some-branch', option => {
    expect(getEditUrl(option, 'blob', 'some-branch')).toBe(
      'https://gitlab.com/gitlab-org/frontend/nuxt-edit-this-page/blob/some-branch',
    );
  });
});
