// Initializes the `foos` service on path `/foos`
const { Foos } = require('./foos.class');
const createModel = require('../../models/foos.model');
const hooks = require('./foos.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: false,
    multi: true
  };

  // Initialize our service with any options it requires
  app.use('/foos', new Foos(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('foos');

  service.hooks(hooks);
};
