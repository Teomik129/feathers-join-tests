const { withResult } = require("feathers-fletching");

const bazHook = withResult({
  bars: async (baz, context, loaders) => {
    return loaders.bars.load(baz._id);
    // If the user is not using barHook on bazzes service,
    // you could just handle the inner join here
    // const bar = await app.service("bars").get(foo.barId);
    // bar.baz = await app.service("bazzes").get(bar.bazId);
    // return bar;
  },
}, (context) => {
  return {
    bars: context.app
      .service('bars')
      .loaderFactory({ id: 'bazId', multi: true })
  }
})

const barHook = withResult({
  foos: (bar, context, loaders) => {
    // console.log('loading foos', bar._id)
    return loaders.foos.load(bar._id)
  },
}, (context) => {
  return {
    foos: context.app
      .service('foos')
      .loaderFactory({ id: 'barId', multi: true })
  }
})

module.exports = async app => {
  app.service("bazzes").hooks({
    after: {
      all: [bazHook]
    }
  });

  app.service("bars").hooks({
    before: {
      // all: [context => { console.log(context.params.query) }]
    },
    after: {
      all: [barHook]
    }
  });

  app.service("foos").hooks({
    before: {
      // all: [context => { console.log(context.params.query) }]
    }
  });

  // console.log(await app.service('foos').find({ query: { barId: 0 } }));

  return app.service("bazzes").find()
}

