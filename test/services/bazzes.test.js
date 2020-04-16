const assert = require('assert');
const app = require('../../src/app');

describe('\'bazzes\' service', () => {
  it('registered the service', () => {
    const service = app.service('bazzes');

    assert.ok(service, 'Registered the service');
  });
});
