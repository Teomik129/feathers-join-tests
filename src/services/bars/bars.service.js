// Initializes the `bars` service on path `/bars`
const { Bars } = require("./bars.class");

module.exports = function (app) {
  const options = {
    paginate: false,
    multi: true,
  };

  // Initialize our service with any options it requires
  app.use("/bars", new Bars(options));
};
