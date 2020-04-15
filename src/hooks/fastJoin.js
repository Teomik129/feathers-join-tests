// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { fastJoin } = require("feathers-hooks-common");

const resolvers = {
  joins: {
    bars: {
      resolver: () => async (foo, { app }) =>
        ([foo.bar] = await app
          .service("bars")
          .find({ query: { id: foo.barId } })),
      joins: {
        baz: () => async (bar, { app }) =>
          ([bar.baz] = await app
            .service("bazzes")
            .find({ query: { id: bar.bazId } })),
      },
    },
  },
};

// eslint-disable-next-line no-unused-vars
module.exports = fastJoin(resolvers);
