jest.mock("consola");

const { Nuxt, Builder } = require("nuxt-edge");
const jsdom = require("jsdom");
const request = require("request-promise-native");
const getConfig = require("./fixture/nuxt.config");

const port = 3001;
const repoUrl = "https://gitlab.com/gitlab-org/frontend/nuxt-edit-this-page";
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

describe("with basic config", () => {
  const getEditUrl = path => `${repoUrl}/edit/master/pages/${path}`;

  beforeAll(async () => {
    nuxt = new Nuxt(getConfig());
    await boot();
  }, 60000);

  afterAll(async () => {
    await nuxt.close();
  });

  describe.each`
    path          | editUrl
    ${"/"}        | ${getEditUrl("index.vue")}
    ${"/users"}   | ${getEditUrl("users/index.vue")}
    ${"/users/1"} | ${getEditUrl("users/_id.vue")}
  `("at $path", ({ path, editUrl }) => {
    it("link renders properly", async () => {
      const dom = await getDom(path);
      expect(dom.querySelector("a.edit-this-page-link")).not.toBeNull();
    });

    it(`link points to ${editUrl}`, async () => {
      const dom = await getDom(path);
      expect(dom.querySelector("a.edit-this-page-link").href).toBe(editUrl);
    });
  });

  it("accepts props", async () => {
    const dom = await getDom("/custom-props");
    const link = dom.querySelector("#link-with-custom-props");
    expect(link).not.toBeNull();
    expect(link.textContent).toBe("Custom text");
    expect(link.href).toContain("https://some-host.example/");
  });

  it("renders scoped slot properly", async () => {
    const dom = await getDom("/scoped-slot");
    const link = dom.querySelector("#link-with-scoped-slot");
    expect(link).not.toBeNull();
    const span = link.querySelector("span");
    expect(span).not.toBeNull();
    expect(span.textContent).toBe(link.href);
  });

  describe("with custom resolver", () => {
    it("renders link properly", async () => {
      const dom = await getDom("/custom-resolver/my-slug");
      expect(dom.querySelector("a.edit-this-page-link")).not.toBeNull();
    });

    it("sets href properly", async () => {
      const dom = await getDom("/custom-resolver/my-slug");
      expect(dom.querySelector("a.edit-this-page-link").href).toBe(
        `${repoUrl}/edit/master/my-slug.md`
      );
    });
  });
});

describe("with incomplete config", () => {
  afterAll(async () => {
    await nuxt.close();
  });

  it("throws an error", async () => {
    nuxt = new Nuxt(getConfig({ fixture: "incomplete-config" }));
    expect(nuxt.ready()).rejects.toThrowError();
  });
});

describe("with different git branch in config", () => {
  const getEditUrl = path => `${repoUrl}/edit/some-branch/pages/${path}`;

  beforeAll(async () => {
    nuxt = new Nuxt(getConfig({ fixture: "branch" }));
    await boot();
  }, 60000);

  afterAll(async () => {
    await nuxt.close();
  });

  describe.each`
    path          | editUrl
    ${"/"}        | ${getEditUrl("index.vue")}
    ${"/users"}   | ${getEditUrl("users/index.vue")}
    ${"/users/1"} | ${getEditUrl("users/_id.vue")}
  `("at $path", ({ path, editUrl }) => {
    it("link renders properly", async () => {
      const dom = await getDom(path);
      expect(dom.querySelector("a.edit-this-page-link")).not.toBeNull();
    });

    it(`link points to ${editUrl}`, async () => {
      const dom = await getDom(path);
      expect(dom.querySelector("a.edit-this-page-link").href).toBe(editUrl);
    });
  });
});
