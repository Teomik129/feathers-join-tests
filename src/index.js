const { deepEqual } = require("assert");

const app = require("./app");
const faker = require("faker/locale/en");
const graphPopulate = require("./hooks/graph-populate");
const fastJoin = require("./hooks/fastJoin");
const withResult = require("./hooks/with-result");

const services = require("./services");

console.info("Configuring services...");
app.configure(services);

const fakeBaz = () => ({
  bs: faker.company.bs(),
  filename: faker.system.fileName(),
  number: faker.random.number(),
  date: faker.date.future(),
});

const fakeBar = (bazId) => ({
  ...fakeBaz(),
  bazId,
});

const fakeFoo = (barId) => ({
  ...fakeBaz(),
  barId,
});

async function speedTests() {
  // Seed services
  console.info("Seeding services...");
  await app.service("bazzes").create(Array.from({ length: 5000 }, fakeBaz));

  await app
    .service("bars")
    .create(Array.from({ length: 5000 }, (_, i) => fakeBar(i)));

  await app
    .service("foos")
    .create(Array.from({ length: 5000 }, (_, i) => fakeFoo(i)));

  // Speed tests

  // withResult - feathers-fletching
  console.info("Testing withResult...");
  app.service("foos").hooks({
    after: {
      find: withResult,
    },
  });

  console.time("withResult");
  const [wrRes] = await app.service("foos").find();
  console.timeEnd("withResult");

  // fastJoin - feathers-hooks-common
  console.info("Testing fastJoin...");
  app.service("foos").hooks({
    after: {
      find: fastJoin,
    },
  });

  console.time("fastJoin");
  const [fjRes] = await app.service("foos").find();
  console.timeEnd("fastJoin");
  // populate - feathers-graph-populate
  console.info("Testing graphPopulate...");
  app.service("foos").hooks({
    after: {
      find: graphPopulate,
    },
  });

  console.time("graphPopulate");
  const [gpRes] = await app.service("foos").find({
    $populateParams: {
      query: {
        bar: {
          baz: {},
        },
      },
    },
  });
  console.timeEnd("graphPopulate");

  // Ensure results are the same
  deepEqual(wrRes, fjRes);
  deepEqual(fjRes, gpRes);

  console.info("Sample output");
  console.dir(wrRes, { depth: null });
}
speedTests();
