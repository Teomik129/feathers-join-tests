const feathers = require("@feathersjs/feathers");
const configuration = require('@feathersjs/configuration');
const faker = require("faker/locale/en");

const services = require("./services");

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

const seed = async () => {
  const app = feathers();

  console.info("Configuring services...");
  app.configure(configuration());
  app.configure(services);

  console.info("Seeding services...");
  const bazzes = await app
    .service("bazzes")
    .create(Array.from({ length: 1000 }, fakeBaz));

  await (async function() {
    for (const baz of bazzes) {
      await app
        .service("bars")
        .create(Array.from({ length: 2 }, () => fakeBar(baz._id)));
    }
  }());

  const bars = await app.service("bars").find();

  await (async function() {
    for (const bar of bars) {
      await app
        .service("foos")
        .create(Array.from({ length: 2 }, () => fakeFoo(bar._id)));
    }
  }());

  console.log("Services Seeded")

  return app;
}

seed();

