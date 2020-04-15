// Initializes the `foos` service on path `/foos`
const { Foos } = require("./foos.class");

module.exports = function (app) {
  const options = {
    paginate: false,
    multi: true,
  };

  // Initialize our service with any options it requires
  app.use("/foos", new Foos(options));
};
