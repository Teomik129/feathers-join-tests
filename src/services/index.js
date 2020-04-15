const foos = require('./foos/foos.service.js');
const bars = require('./bars/bars.service.js');
const bazzes = require('./bazzes/bazzes.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(foos);
  app.configure(bars);
  app.configure(bazzes);
};
