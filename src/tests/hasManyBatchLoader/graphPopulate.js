const { populate } = require("feathers-graph-populate");

const populates = {
  bars: {
    service: "bars",
    nameAs: "bars",
    keyHere: "_id",
    keyThere: "bazId",
    asArray: true,
    params: {},
  },
  foos: {
    service: "foos",
    nameAs: "foos",
    keyHere: "_id",
    keyThere: "barId",
    asArray: true,
    params: {},
  },
};

module.exports = async app => {
  app.service("bazzes").hooks({
    after: {
      all: [populate({ populates })]
    }
  });

  return app.service("bazzes").find({
    $populateParams: {
      query: {
        bars: {
          foos: {}
        }
      }
    }
  })
}
