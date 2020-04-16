const { withResult } = require("feathers-fletching");

const fooHook = withResult({
  bar: async (foo, { app }) => {
    return app.service("bars").get(foo.barId);
    // If the user is not using barHook on bazzes service,
    // you could just handle the inner join here
    // const bar = await app.service("bars").get(foo.barId);
    // bar.baz = await app.service("bazzes").get(bar.bazId);
    // return bar;
  },
})

const barHook = withResult({
  baz: (bar, { app }) => {
    return app.service("bazzes").get(bar.bazId)
  },
})

module.exports = async app => {
  app.service("foos").hooks({
    after: {
      all: [fooHook]
    }
  });

  app.service("bars").hooks({
    after: {
      all: [barHook]
    }
  });

  return app.service("foos").find()
}

