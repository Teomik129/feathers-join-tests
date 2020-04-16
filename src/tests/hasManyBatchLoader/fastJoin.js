const { fastJoin } = require("feathers-hooks-common");

const bazResolvers = {
  before: context => {
    context.loaders = {};
    context.loaders.bars = context.app
      .service('bars')
      .loaderFactory({ id: 'bazId', multi: true });
  },
  joins: {
    bars: {
      resolver: () => async (baz, { loaders }) => {
        baz.bars = await loaders.bars.load(baz._id);
        return baz;
      },
    },
  },
};

// const resolvers = {
//   before: context => {
//     context.loaders = {};
//     context.loaders.bars = context.app
//       .service('bars')
//       .loaderFactory({ id: 'bazId', multi: true });

//     context.loaders.foos = context.app
//       .service('foos')
//       .loaderFactory({ id: 'barId', multi: true });
//   },
//   joins: {
//     bars: {
//       resolver: () => async (baz, { loaders }) =>
//         (baz.bars = await loaders.bars.load(baz._id)),
//       joins: {
//         baz: () => async (bar, { loaders }) =>
//           (bar.foos = await loaders.foos.load(bar._id)),
//       },
//     },
//   },
// };

const barResolvers = {
  before: context => {
    context.loaders = {};
    context.loaders.foos = context.app
      .service('foos')
      .loaderFactory({ id: 'barId', multi: true });
  },
  joins: {
    foos: {
      resolver: () => async (bar, { loaders }) => {
        bar.foos = await loaders.foos.load(bar._id);
        return bar;
      }
    },
  },
};


// eslint-disable-next-line no-unused-vars

module.exports = async app => {
  app.service("bazzes").hooks({
    after: {
      // all: [fastJoin(resolvers)]
      all: [fastJoin(bazResolvers)]
    }
  });

  app.service("bars").hooks({
    before: {
      // all: [context => { console.log(context.params.query) }]
    },
    after: {
      all: [
        context => {
          // batchLoader tries to skip itself with _populate: 'skip'
          context.params._populate = null
        },
        fastJoin(barResolvers)
      ]
    }
  });

  app.service("foos").hooks({
    before: {
      // all: [context => { console.log(context.params.query) }]
    },
  });

  // console.log(await app.service('bars').find({ query: { id: 0 } }));

  return app.service("bazzes").find()
}
