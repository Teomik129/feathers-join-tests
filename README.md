# feathers-join-tests

> Speed tests for various join methods

## About

This project runs basic speed tests for various implementations of joining/populating hooks using [Feathers](http://feathersjs.com). Thus far the hooks tested are:

- [`withResult`](https://daddywarbucks.github.io/feathers-fletching/hooks.html#withresult) from [`feathers-fletching`](https://daddywarbucks.github.io/feathers-fletching/overview.html)
- [`fastJoin`](https://hooks-common.feathersjs.com/hooks.html#fastjoin) from [`feathers-hooks-common`](https://hooks-common.feathersjs.com)
- [`populate`](https://feathers-graph-populate.netlify.app/getting-started.html#register-the-populate-hook) from [`feathers-graph-populate`](https://feathers-graph-populate.netlify.app/)

To run the tests, first run `npm run seed`. \
Then run any test case such as `npm run test:belongsTo` or `npm test` to run all cases.
