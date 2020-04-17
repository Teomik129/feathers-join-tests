const { populate } = require("feathers-graph-populate");
const afterAll = require("../util/afterAll");

const fooPops = {
  bar: {
    service: "bars",
    nameAs: "bar",
    keyHere: "barId",
    keyThere: "_id",
    asArray: false,
    params: {},
  },
};

const barPops = {
  foos: {
    service: "foos",
    nameAs: "foos",
    keyHere: "_id",
    keyThere: "barId",
    asArray: true,
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

const bazPops = {
  bars: {
    service: "bars",
    nameAs: "bars",
    keyHere: "_id",
    keyThere: "bazId",
    asArray: true,
    params: {},
  },
};

module.exports = () =>
  [fooPops, barPops, bazPops].map((populates) =>
    afterAll(populate({ populates }))
  );
