// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { fastJoin } = require("feathers-hooks-common");
const afterAll = require("../util/afterAll");

const fooResolvers = {
  joins: {
    bar: () => async (foo, { app }) =>
      (foo.bar = await app.service("bars").get(foo.barId)),
  },
};

const barResolvers = {
  joins: {
    foos: () => async (bar, { app }) =>
      (bar.foos = await app
        .service("foos")
        .find({ query: { barId: bar._id } })),
    baz: () => async (bar, { app }) =>
      (bar.baz = await app.service("bazzes").get(bar.bazId)),
  },
};

const bazResolvers = {
  joins: {
    bars: () => async (baz, { app }) =>
      (baz.bars = await app
        .service("bars")
        .find({ query: { bazId: baz._id } })),
  },
};

const fooBatchResolvers = {
  before: (context) => {
    context.loaders = {
      bars: context.app.service("bars").loaderFactory(),
    };
  },
  joins: {
    bar: () => async (foo, { loaders }) =>
      (foo.bar = await loaders.bars.load(foo.barId)),
  },
};

const barBatchResolvers = {
  before: (context) => {
    context.loaders = {
      foos: context.app
        .service("foos")
        .loaderFactory({ id: "barId", multi: true }),
      bazzes: context.app.service("bazzes").loaderFactory(),
    };
  },
  joins: {
    foos: () => async (bar, { loaders }) =>
      (bar.foos = await loaders.foos.load(bar._id)),
    baz: () => async (bar, { loaders }) =>
      (bar.baz = await loaders.bazzes.load(bar.bazId)),
  },
};

const bazBatchResolvers = {
  before: (context) => {
    context.loaders = {
      bars: context.app
        .service("bars")
        .loaderFactory({ id: "bazId", multi: true }),
    };
  },
  joins: {
    bars: () => async (baz, { loaders }) =>
      (baz.bars = await loaders.bars.load(baz._id)),
  },
};

module.exports = (opts = {}) => {
  const { batch, many } = opts;

  const queries = [
    {
      bar: !many,
    },
    {
      foos: many,
      baz: !many,
    },
    {
      bars: many,
    },
  ];
  return (batch
    ? [fooBatchResolvers, barBatchResolvers, bazBatchResolvers]
    : [fooResolvers, barResolvers, bazResolvers]
  ).map((resolver, i) => afterAll(fastJoin(resolver, queries[i])));
};
