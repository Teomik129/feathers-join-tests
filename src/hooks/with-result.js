const { withResult } = require("feathers-fletching");

module.exports = withResult({
  bar: async (result, { app }) => {
    const [bar] = await app
      .service("bars")
      .find({ query: { id: result.barId } });
    const [baz] = await app
      .service("bazzes")
      .find({ query: { id: bar.bazId } });
    return { ...bar, baz };
  },
});
