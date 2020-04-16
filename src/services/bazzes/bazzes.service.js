// Initializes the `bazzes` service on path `/bazzes`
const { Bazzes } = require('./bazzes.class');
const createModel = require('../../models/bazzes.model');
const hooks = require('./bazzes.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: false,
    multi: true
  };

  // Initialize our service with any options it requires
  app.use('/bazzes', new Bazzes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('bazzes');

  service.hooks(hooks);
};
