const { populate } = require("feathers-graph-populate");

const populates = {
  bar: {
    service: "bars",
    nameAs: "bar",
    keyHere: "barId",
    keyThere: "id",
    asArray: false,
    params: {},
  },
  baz: {
    service: "bazzes",
    nameAs: "baz",
    keyHere: "bazId",
    keyThere: "id",
    asArray: false,
    params: {},
  },
};

module.exports = populate({ populates });
