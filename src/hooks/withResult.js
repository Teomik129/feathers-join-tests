const { withResult } = require("feathers-fletching");
const afterAll = require("../util/afterAll");

const fooResult = {
  bar: async (foo, { app }) => app.service("bars").get(foo.barId),
};

const barResult = {
  foos: (bar, { app }) =>
    app.service("foos").find({ query: { barId: bar._id } }),
  baz: (bar, { app }) => app.service("bazzes").get(bar.bazId),
};

const bazResult = {
  bars: async (baz, { app }) =>
    app.service("bars").find({ query: { bazId: baz._id } }),
};

const [fooBatchResult, fooBatchPrep] = [
  {
    bar: async (foo, context, loaders) => loaders.bars.load(foo.barId),
  },
  ({ app }) => ({
    bars: app.service("bars").loaderFactory(),
  }),
];

const [barBatchResult, barBatchPrep] = [
  {
    foos: (bar, context, loaders) => loaders.foos.load(bar._id),
    baz: (bar, context, loaders) => loaders.bazzes.load(bar.bazId),
  },
  ({ app }) => ({
    foos: app.service("foos").loaderFactory({ id: "barId", multi: true }),
    bazzes: app.service("bazzes").loaderFactory(),
  }),
];

const [bazBatchResult, bazBatchPrep] = [
  {
    bars: async (baz, context, loaders) => loaders.bars.load(baz._id),
  },
  ({ app }) => ({
    bars: app.service("bars").loaderFactory({ id: "bazId", multi: true }),
  }),
];

const exclude = () => undefined;

module.exports = (opts = {}) => {
  const { batch, many } = opts;

  if (many) {
    fooResult.bar = exclude;
    fooBatchResult.bar = exclude;
    barResult.baz = exclude;
    barBatchResult.baz = exclude;
  } else {
    barResult.foos = exclude;
    barBatchResult.foos = exclude;
    bazResult.bars = exclude;
    bazBatchResult.bars = exclude;
  }

  const preps = [fooBatchPrep, barBatchPrep, bazBatchPrep];

  return (batch
    ? [fooBatchResult, barBatchResult, bazBatchResult]
    : [fooResult, barResult, bazResult]
  ).map((res, i) => afterAll(withResult(res, batch && preps[i])));
};
