# feathers-join-tests

> Speed tests for various join methods

## About

This project runs basic speed tests for various implementations of joining/populating hooks using [Feathers](http://feathersjs.com). It generates 3 in-memory services with 5000 records each and performs a depth 2 join using a given hook i.e. objects from `foos` contain objects from `bars` which contain objects from `bazzes`. Thus far the hooks tested are:

- [`withResult`](https://daddywarbucks.github.io/feathers-fletching/hooks.html#withresult) from [`feathers-fletching`](https://daddywarbucks.github.io/feathers-fletching/overview.html)
- [`fastJoin`](https://hooks-common.feathersjs.com/hooks.html#fastjoin) from [`feathers-hooks-common`](https://hooks-common.feathersjs.com)
- [`populate`](https://feathers-graph-populate.netlify.app/getting-started.html#register-the-populate-hook) from [`feathers-graph-populate`](https://feathers-graph-populate.netlify.app/)

Sample output from my laptop (Core i7, 16GB):

```sh
Testing withResult...
withResult: 11.031s
Testing fastJoin...
fastJoin: 21.610s
Testing graphPopulate...
graphPopulate: 1:23.842
```

To run the tests, simply run `npm test`
