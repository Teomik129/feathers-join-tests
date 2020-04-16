const assert = require('assert');
const app = require('../../src/app');

describe('\'foos\' service', () => {
  it('registered the service', () => {
    const service = app.service('foos');

    assert.ok(service, 'Registered the service');
  });
});
