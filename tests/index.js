const graphPopulate = require("../src/hooks/graphPopulate");
const fastJoin = require("../src/hooks/fastJoin");
const withResult = require("../src/hooks/withResult");
const createApp = require("../src/app");
const deepEqual = require("deep-equal");
const afterAll = require("../src/util/afterAll");

const services = ["foos", "bars", "bazzes"];

const applyHooks = (app, hooks) =>
  services.forEach((serv, i) => app.service(serv).hooks(afterAll(hooks[i])));

module.exports = async function speedTests(opts = {}) {
  const { many } = opts;

  const start = many ? "bazzes" : "foos";

  const results = [];

  // withResult - feathers-fletching
  console.info("Testing withResult...");
  const wrApp = createApp();
  const wrHooks = withResult(opts);
  applyHooks(wrApp, wrHooks);
  console.time("withResult");
  const [wrRes] = await wrApp.service(start).find();
  console.timeEnd("withResult");
  results.push(wrRes);

  // fastJoin - feathers-hooks-common
  console.info("Testing fastJoin...");
  const fjApp = createApp();
  const fjHooks = fastJoin(opts);
  applyHooks(fjApp, fjHooks);
  console.time("fastJoin");
  const [fjRes] = await fjApp.service(start).find();
  console.timeEnd("fastJoin");
  results.push(fjRes);

  // populate - feathers-graph-populate
  console.info("Testing graphPopulate...");

  const query = (many ? ["bars", "foos"] : ["bar", "baz"]).reduce(
    (acc, key) => {
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
    },
    {}
  );

  const gpApp = createApp();
  const gpHooks = graphPopulate();
  applyHooks(gpApp, gpHooks);
  console.time("graphPopulate");
  const [gpRes] = await gpApp
    .service(start)
    .find({ $populateParams: { query } });
  console.timeEnd("graphPopulate");
  results.push(gpRes);

  // Ensure results are the same
  const diff = results.find((res) => !deepEqual(res, results[0]));
  if (diff) {
    console.warn("Results do not match", diff);
  }

  console.info("Expected output");
  console.dir(wrRes, { depth: null });
};
