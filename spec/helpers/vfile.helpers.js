const VFile = require('vfile');

const { fmtInline } = require('./format.helpers');

VFile.prototype.jasmineToString = function() {
  return `VFile({ path: ${fmtInline(this.path)}, contents: ${fmtInline(this.contents)} })`;
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
          return `<vfile.withCurrentPath ${fmtInline(expected)}>`;
        }
      }
    },
    withHistoricalPath(expected) {
      return {
        asymmetricMatch(actual, customTesters) {
          return jasmine.matchersUtil.contains(actual.history, expected, customTesters);
        },
        jasmineToString() {
          return `<vfile.withHistoricalPath ${fmtInline(expected)}>`;
        }
      }
    }
  };
});
