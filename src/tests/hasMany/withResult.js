const { withResult } = require("feathers-fletching");

const bazHook = withResult({
  bars: async (baz, { app }) => {
    return app.service("bars").find({ query: { bazId: baz._id } });
    // If the user is not using barHook on bazzes service,
    // you could just handle the inner join here
    // const bar = await app.service("bars").get(foo.barId);
    // bar.baz = await app.service("bazzes").get(bar.bazId);
    // return bar;
  },
})

const barHook = withResult({
  foos: (bar, { app }) => {
    return app.service("foos").find({ query: { barId: bar._id } })
  },
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

  return app.service("bazzes").find()
}

