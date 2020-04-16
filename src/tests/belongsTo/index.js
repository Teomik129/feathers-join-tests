const graphPopulate = require("./graphPopulate");
const fastJoin = require("./fastJoin");
const withResult = require("./withResult");

const createApp = require('../../app');

async function speedTests() {

  // withResult - feathers-fletching
  console.info("Testing withResult...");
  console.time("withResult");
  const [wsRes] = await withResult(createApp());
  console.timeEnd("withResult");

  // fastJoin - feathers-hooks-common
  console.info("Testing fastJoin...");
  console.time("fastJoin");
  const [fjRes] = await fastJoin(createApp())
  console.timeEnd("fastJoin");

  // populate - feathers-graph-populate
  console.info("Testing graphPopulate...");
  console.time("graphPopulate");
  const [gpRes] = await graphPopulate(await createApp());
  console.timeEnd("graphPopulate");

  // Ensure results are the same


  console.info("Sample output");
  console.dir(wsRes, { depth: null });
  console.dir(fjRes, { depth: null });
  console.dir(gpRes, { depth: null });
}
speedTests();
