const createApp = require("../src/app");
const afterAll = require("../src/util/afterAll");
const { writeJson } = require("fs-extra");
const { join } = require("path");
const { performance, PerformanceObserver } = require("perf_hooks");

const observer = new PerformanceObserver((items) => {
  const [{ duration }] = items.getEntries();
  const seconds = Math.floor(duration / 1000);
  const milliseconds = (duration % 1000).toPrecision(6);
  console.info(`${hook}: ${seconds}s ${milliseconds}ms`);
});

observer.observe({ entryTypes: ["measure"] });

const services = ["foos", "bars", "bazzes"];

const hook = process.argv[2];

const opts = JSON.parse(process.argv[3] || "{}");

const { many } = opts;

const start = many ? "bazzes" : "foos";

async function testRunner() {
  const app = createApp();

  const hooks = require(`../src/hooks/${hook}`)(opts);

  hooks.forEach((hook, i) => {
    app.service(services[i]).hooks(afterAll(hook));
  });

  const $populateParams = {
    query: many
      ? {
          bars: { foos: {} },
        }
      : {
          bar: { baz: {} },
        },
  };

  const [hookStart, hookEnd] = ["start", "end"].map((str) => `${hook}_${str}`);

  performance.mark(hookStart);
  const [res] = await app
    .service(start)
    .find(hook === "graphPopulate" && { $populateParams });
  performance.mark(hookEnd);
  performance.measure(hook, hookStart, hookEnd);

  await writeJson(join(__dirname, `${hook}-output.json`), res, { spaces: 2 });
}

testRunner();
