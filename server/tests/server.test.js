const server = require('../src/server');

describe('Server', () => {
  describe('It should provide a valid server', () => {
    it('Should return a valid instance', () => {
      expect(server).toBeDefined();
    });
  });
});
