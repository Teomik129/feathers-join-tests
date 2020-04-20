const createApp = require("../src/app");
const afterAll = require("../src/util/afterAll");
const { writeJson } = require("fs-extra");
const { join } = require("path");

const services = ["foos", "bars", "bazzes"];

const applyHooks = (app, hooks) =>
  services.forEach((serv, i) => app.service(serv).hooks(afterAll(hooks[i])));

const hook = process.argv[2];

const opts = JSON.parse(process.argv[3] || "{}");

const { many } = opts;

const start = many ? "bazzes" : "foos";

async function testRunner() {
  const app = createApp();

  const hooks = require(`../src/hooks/${hook}`)(opts);

  applyHooks(app, hooks);


  const $populateParams = {
    query: (many ? ["bars", "foos"] : ["bar", "baz"]).reduce((acc, key) => {
      const [prevKey] = Object.keys(acc);
      return prevKey
        ? {
            [prevKey]: {
              [key]: {},
            },
          }
        : {
            [key]: {},
          };
    }, {}),
  };

  console.time(hook);
  const [res] = await app
    .service(start)
    .find(hook === "graphPopulate" && { $populateParams });
  console.timeEnd(hook);

  await writeJson(join(__dirname, `${hook}-output.json`), res);

}

testRunner();
