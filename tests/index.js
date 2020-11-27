const deepEqual = require("deep-equal");
const execa = require("execa");
const { join } = require("path");
const { readJson } = require("fs-extra");

const hooks = ["withResult", "fastJoin", "graphPopulate"];

module.exports = async function speedTests(opts = {}) {
  const results = [];

  for (const hook of hooks) {
    const { stdout } = await execa.node(join(__dirname, "testRunner.js"), [
      hook,
      JSON.stringify(opts),
    ]);

    console.info(stdout);

    results.push(await readJson(join(__dirname, `${hook}-output.json`)));
  }

  // Ensure results are the same
  console.assert(
    results.every((res) => deepEqual(res, results[0])),
    "Results do not match"
  );
};
