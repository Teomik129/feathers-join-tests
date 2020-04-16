const { populate } = require("feathers-graph-populate");

const populates = {
  bar: {
    service: "bars",
    nameAs: "bar",
    keyHere: "barId",
    keyThere: "_id",
    asArray: false,
    params: {},
  },
  baz: {
    service: "bazzes",
    nameAs: "baz",
    keyHere: "bazId",
    keyThere: "_id",
    asArray: false,
    params: {},
  },
};

module.exports = async app => {
  app.service("foos").hooks({
    after: {
      all: [populate({ populates })]
    }
  });

  return app.service("foos").find({
    $populateParams: {
      query: {
        bar: {
          baz: {}
        }
      }
    }
  })
}
