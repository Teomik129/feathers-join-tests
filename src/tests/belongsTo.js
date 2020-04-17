const graphPopulate = require("../hooks/graphPopulate");
const fastJoin = require("../hooks/fastJoin");
const withResult = require("../hooks/withResult");
const { deepEqual } = require("assert");

const createApp = require("../app");

async function speedTests() {
  // withResult - feathers-fletching
  console.info("Testing withResult...");
  console.time("withResult");
  const [wsRes] = await withResult(createApp());
  console.timeEnd("withResult");

  // fastJoin - feathers-hooks-common
  console.info("Testing fastJoin...");
  console.time("fastJoin");
  const [fjRes] = await fastJoin(createApp());
  console.timeEnd("fastJoin");

  // populate - feathers-graph-populate
  console.info("Testing graphPopulate...");
  console.time("graphPopulate");
  const [gpRes] = await graphPopulate(createApp());
  console.timeEnd("graphPopulate");

  // Ensure results are the same
  deepEqual(wsRes, fjRes);
  deepEqual(fjRes, gpRes);

  console.info("Sample output");
  console.dir(wsRes, { depth: null });
}
speedTests();
