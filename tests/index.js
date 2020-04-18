const deepEqual = require("deep-equal");
const execa = require("execa");
const { join } = require("path");
const { readJson } = require("fs-extra");

const hooks = ["withResult", "fastJoin", "graphPopulate"];

module.exports = async function speedTests(opts = {}) {
  const results = [];

  for (const hook of hooks) {
    console.info(`Testing ${hook}...`)

    const { stdout } = await execa("node", [
      join(__dirname, "testRunner.js"),
      hook,
      JSON.stringify(opts),
    ]);

    console.info(stdout);

    results.push(await readJson(join(__dirname, `${hook}-output.json`)))
  }

  // Ensure results are the same
  const diff = results.find((res) => !deepEqual(res, results[0]));
  if (diff) {
    console.warn("Results do not match", diff);
  }

  console.info("Expected output");
  console.dir(results[0], { depth: null });
};
