const graphPopulate = require("../hooks/graphPopulate");
const fastJoin = require("../hooks/fastJoin");
const withResult = require("../hooks/withResult");
const { deepEqual } = require("assert");

const createApp = require("../app");

async function speedTests() {
  const many = async (hook) => hook(await createApp(), { many: true });

  // withResult - feathers-fletching
  console.info("Testing withResult...");
  console.time("withResult");
  const [wsRes] = await many(withResult);
  console.timeEnd("withResult");

  // fastJoin - feathers-hooks-common
  console.info("Testing fastJoin...");
  console.time("fastJoin");
  const [fjRes] = await many(fastJoin);
  console.timeEnd("fastJoin");

  // populate - feathers-graph-populate
  console.info("Testing graphPopulate...");
  console.time("graphPopulate");
  const [gpRes] = await many(graphPopulate);
  console.timeEnd("graphPopulate");

  // Ensure results are the same
  deepEqual(wsRes, fjRes);
  deepEqual(fjRes, gpRes);

  console.info("Sample output");
  console.dir(wsRes, { depth: null });
}
speedTests();
