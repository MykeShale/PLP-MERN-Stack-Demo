// sampleUtil.js - Sample utility function for demonstration
function add(a, b) {
  return a + b;
}

// Export for testing
module.exports = { add };

// sampleUtil.test.js - Unit test for sample utility function
const { add } = require('./sampleUtil');

describe('add utility function', () => {
  it('should add two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
    expect(add(0, 0)).toBe(0);
  });
}); 