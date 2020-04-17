const feathers = require("@feathersjs/feathers");
const configuration = require("@feathersjs/configuration");
const { remove } = require("fs-extra");

const services = require("./services");

const fakeBaz = () => ({
  value: "BAZ",
});

const fakeBar = (bazId) => ({
  value: "BAR",
  bazId,
});

const fakeFoo = (barId) => ({
  value: "FOO",
  barId,
});

const seed = async () => {
  const app = feathers();

  console.info("Configuring services...");

  app.configure(configuration());
  await remove(app.get("nedb"));
  app.configure(services);

  console.info("Seeding services...");

  const bazzes = await app
    .service("bazzes")
    .create(Array.from({ length: 1000 }, fakeBaz));

  const bars = await Promise.all(
    bazzes.map((baz) =>
      app
        .service("bars")
        .create(Array.from({ length: 2 }, () => fakeBar(baz._id)))
    )
  );

  await Promise.all(
    bars
      .flat()
      .map((bar) =>
        app
          .service("foos")
          .create(Array.from({ length: 2 }, () => fakeFoo(bar._id)))
      )
  );

  console.log("Services Seeded");

  return app;
};

seed();
