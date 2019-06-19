const { Nuxt, Builder } = require('nuxt-edge');
const jsdom = require('jsdom');
const request = require('request-promise-native');
const getConfig = require('./fixture/nuxt.config');

const port = 3001;
const repoUrl = 'https://gitlab.com/gitlab-org/frontend/nuxt-edit-this-page';
const { JSDOM } = jsdom;

let nuxt;

const boot = async () => {
  await nuxt.ready();
  await new Builder(nuxt).build();
  await nuxt.listen(port);
};

const url = path => `http://localhost:${port}${path}`;
const getDom = async path => {
  const html = await request(url(path));
  return new JSDOM(html).window.document;
};

describe('config', () => {
  describe('incomplete', () => {
    it('throws an error', async () => {
      nuxt = new Nuxt(getConfig({ fixture: 'incomplete-config' }));
      expect(nuxt.ready()).rejects.toThrowError();
    });
  });

  describe('basic', () => {
    const getEditUrl = path => `${repoUrl}/edit/master/pages/${path}`;

    afterAll(async () => {
      await nuxt.close();
    });
    beforeAll(async () => {
      nuxt = new Nuxt(getConfig());
      await boot();
    }, 60000);

    describe.each`
      path          | editUrl
      ${'/'}        | ${getEditUrl('index.vue')}
      ${'/users'}   | ${getEditUrl('users/index.vue')}
      ${'/users/1'} | ${getEditUrl('users/_id.vue')}
    `('at $path edit link', ({ path, editUrl }) => {
      it('renders properly', async () => {
        const dom = await getDom(path);
        expect(dom.querySelector('a.edit-this-page-link')).not.toBeNull();
      });

      it(`points to ${editUrl}`, async () => {
        const dom = await getDom(path);
        expect(dom.querySelector('a.edit-this-page-link').href).toBe(editUrl);
      });
    });
  });

  describe('different git branch', () => {
    const getEditUrl = path => `${repoUrl}/edit/some-branch/pages/${path}`;
    afterAll(async () => {
      await nuxt.close();
    });
    beforeAll(async () => {
      nuxt = new Nuxt(getConfig({ fixture: 'branch' }));
      await boot();
    }, 60000);

    describe.each`
      path          | editUrl
      ${'/'}        | ${getEditUrl('index.vue')}
      ${'/users'}   | ${getEditUrl('users/index.vue')}
      ${'/users/1'} | ${getEditUrl('users/_id.vue')}
    `('at $path edit link', ({ path, editUrl }) => {
      it('renders properly', async () => {
        const dom = await getDom(path);
        expect(dom.querySelector('a.edit-this-page-link')).not.toBeNull();
      });

      it(`points to ${editUrl}`, async () => {
        const dom = await getDom(path);
        expect(dom.querySelector('a.edit-this-page-link').href).toBe(editUrl);
      });
    });
  });
});

describe('props', () => {
    afterAll(async () => {
      await nuxt.close();
    });
    beforeAll(async () => {
      nuxt = new Nuxt(getConfig());
      await boot();
    }, 60000);

    it('link renders properly', async () => {
      const dom = await getDom('/custom-resolver/my-slug');
      expect(dom.querySelector('a.edit-this-page-link')).not.toBeNull();
    });

    it(`link points to `, async () => {
      const dom = await getDom('/custom-resolver/my-slug');
      expect(dom.querySelector('a.edit-this-page-link').href).toBe(`${repoUrl}/edit/master/my-slug.md`);
    });
})
