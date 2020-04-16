const assert = require('assert');
const app = require('../../src/app');

describe('\'bars\' service', () => {
  it('registered the service', () => {
    const service = app.service('bars');

    assert.ok(service, 'Registered the service');
  });
});
