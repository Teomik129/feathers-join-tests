// Initializes the `bars` service on path `/bars`
const { Bars } = require('./bars.class');
const createModel = require('../../models/bars.model');
const hooks = require('./bars.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: false,
    multi: true
  };

  // Initialize our service with any options it requires
  app.use('/bars', new Bars(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('bars');

  service.hooks(hooks);
};
