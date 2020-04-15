// Initializes the `bazzes` service on path `/bazzes`
const { Bazzes } = require("./bazzes.class");

module.exports = function (app) {
  const options = {
    paginate: false,
    multi: true,
  };

  // Initialize our service with any options it requires
  app.use("/bazzes", new Bazzes(options));
};
