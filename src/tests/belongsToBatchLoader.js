const graphPopulate = require("../hooks/graphPopulate");
const fastJoin = require("../hooks/fastJoin");
const withResult = require("../hooks/withResult");
const createApp = require("../app");
const { deepEqual } = require("assert");

async function speedTests() {
  const batched = async (hook) => hook(await createApp(), { batch: true });

  // withResult - feathers-fletching
  console.info("Testing withResult...");
  console.time("withResult");
  const [wsRes] = await batched(withResult);
  console.timeEnd("withResult");

  // fastJoin - feathers-hooks-common
  console.info("Testing fastJoin...");
  console.time("fastJoin");
  const [fjRes] = await batched(fastJoin);
  console.timeEnd("fastJoin");

  // populate - feathers-graph-populate
  console.info("Testing graphPopulate...");
  console.time("graphPopulate");
  const [gpRes] = await batched(graphPopulate);
  console.timeEnd("graphPopulate");

  // Ensure results are the same
  deepEqual(wsRes, fjRes);
  deepEqual(fjRes, gpRes);

  console.info("Sample output");
  console.dir(wsRes, { depth: null });
}

speedTests();
