const util = require('util');

const VFile = require('vfile');

VFile.prototype.jasmineToString = function() {
  return `VFile({ path: ${util.inspect(this.path)}, contents: ${util.inspect(this.contents)} })`;
}

beforeAll(function() {
  jasmine.vfile = {
    anyFile() {
      return {
        asymmetricMatch(actual) {
          return actual instanceof VFile;
        },
        jasmineToString() {
          return '<vfile.anyFile>'
        }
      }
    },
    withCurrentPath(expected) {
      return {
        asymmetricMatch(actual, customTesters) {
          return jasmine.matchersUtil.equals(actual.path, expected, customTesters);
        },
        jasmineToString() {
          return `<vfile.withCurrentPath ${util.inspect(expected)}>`;
        }
      }
    },
    withHistoricalPath(expected) {
      return {
        asymmetricMatch(actual, customTesters) {
          return jasmine.matchersUtil.contains(actual.history, expected, customTesters);
        },
        jasmineToString() {
          return `<vfile.withHistoricalPath ${util.inspect(expected)}>`;
        }
      }
    }
  };
});
