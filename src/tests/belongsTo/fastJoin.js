// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { fastJoin } = require("feathers-hooks-common");

const fooResolvers = {
  joins: {
    bars: {
      resolver: () => async (foo, { app }) => {
        foo.bar = await app.service("bars").get(foo.barId);
        return foo;
      },
      // joins: {
      //   baz: () => async (foo, { app }) => {
      //     foo.bar.baz = await app.service("bazzes").get(foo.bar.bazId);
      //     return foo;
      //   }
      // },
    },
  },
};

const barResolvers = {
  joins: {
    baz: {
      resolver: () => async (bar, { app }) => {
        bar.baz = await app.service("bazzes").get(bar.bazId);
        return bar;
      }
    },
  },
};

// So confused on the difference between these...
// Why is bar availble in joins.baz below when using finds...
// but in joins.baz above I have to access foo.bar.baz...?

// const resolvers = {
//   joins: {
//     bars: {
//       resolver: () => async (foo, { app }) =>
//         ([foo.bar] = await app
//           .service("bars")
//           .find({ query: { id: foo.barId } })),
//       joins: {
//         baz: () => async (bar, { app }) =>
//           ([bar.baz] = await app
//             .service("bazzes")
//             .find({ query: { id: bar.bazId } })),
//       },
//     },
//   },
// };


// eslint-disable-next-line no-unused-vars

module.exports = async app => {
  app.service("foos").hooks({
    after: {
      all: [fastJoin(fooResolvers)]
    }
  });

  app.service("bars").hooks({
    after: {
      all: [fastJoin(barResolvers)]
    }
  });

  return app.service("foos").find()
}
