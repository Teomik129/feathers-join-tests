const feathers = require("@feathersjs/feathers");
const configuration = require('@feathersjs/configuration');
const BatchLoader = require('@feathers-plus/batch-loader');
const { GeneralError } = require('@feathersjs/errors');

const services = require('./services');

module.exports = () => {
  const app = feathers();
  app.configure(configuration());

  // Simple syntax for creating batchloaders
  app.mixins.push(function(service) {
    service.loaderFactory = function(opts = {}) {
      if (!service.find) {
        throw new GeneralError(
          `Cannot call the loaderFactory() method on this service because it does not have a find() method.`
        );
      }
      const { params = {}, ...rest } = opts;
      const options = {
        id: '_id',
        multi: false,
        ...rest
      };
      const serviceParams = {
        paginate: false,
        ...params
      };
      return new BatchLoader(async keys => {
        const result = await service.find({
          ...serviceParams,
          query: {
            [options.id]: { $in: BatchLoader.getUniqueKeys(keys) },
            ...serviceParams.query
          }
        });
        return BatchLoader.getResultsByKey(
          keys,
          result.data ? result.data : result,
          rec => rec[options.id],
          options.multi ? '[!]' : '!'
        );
      });
    };
  });

  app.configure(services);

  return app;
}
