const { withResult } = require("feathers-fletching");

const fooHook = withResult({
  bar: async (foo, context, loaders) => {
    return loaders.bars.load(foo.barId);
  }
}, (context) => {
  return {
    bars: context.app.service('bars').loaderFactory()
  }
});

const barHook = withResult({
  baz: (bar, context, loaders) => {
    return loaders.bazzes.load(bar.bazId)
  },
}, (context) => {
  return {
    bazzes: context.app.service('bazzes').loaderFactory()
  }
})

module.exports = async app => {
  app.service("foos").hooks({
    after: {
      all: [fooHook]
    }
  });

  app.service("bars").hooks({
    before: {
      all: [
        // context => { console.log(context.params.query) }
      ]
    },
    after: {
      all: [barHook]
    }
  });

  return app.service("foos").find()
}

