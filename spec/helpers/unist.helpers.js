const assert = require('mdast-util-assert');
const diff = require('unist-diff');
const is = require('unist-util-is');

const { fmtInline, fmtBlock } = require('./format.helpers');

beforeAll(function() {
  jasmine.unist = {
    anyNode() {
      return {
        asymmetricMatch(actual) {
          return is(null, actual);
        },
        jasmineToString() {
          return '<unist.anyNode>'
        }
      }
    },
    nodeMatching(test) {
      return {
        asymmetricMatch(actual) {
          return is(test, actual);
        },
        jasmineToString() {
          return `<unist.nodeMatching ${fmtInline(test)}>`
        }
      }
    }
  };
});

beforeEach(function() {
  jasmine.addMatchers({
    toMatchNode() {
      return {
        compare(actual, expected) {
          const pass = is(expected, actual);
          const message = `Expected test ${fmtInline(expected)} to ${pass ? 'fail' : 'succeed'} for node: ${fmtBlock(actual)}`;
          return { pass, message };
        }
      }
    },
    toContainNode() {
      return {
        compare(actual, expected) {
          function find(node) {
            if (is(expected, node)) {
              return node;
            } else {
              return node.children && node.children.find(find);
            }
          }

          const match = find(actual);
          const pass = match !== undefined;

          let message;
          if (pass) {
            message = `Expected test ${fmtInline(expected)} to fail for all descendents of node: ${fmtBlock(actual)} but found: ${fmtBlock(match)}`;
          } else {
            message = `Expected test ${fmtInline(expected)} to succeed for a descendent of node: ${fmtBlock(actual)}`;
          }

          return { pass, message };
        }
      }
    },
    toEqualNode() {
      return {
        compare(actual, expected) {
          assert(actual);
          assert(expected);

          const result = diff(actual, expected);
          delete result.type;
          delete result.left;
          delete result.right;

          // if any keys are remaining, there is a difference between `actual` and `expected`
          const pass = Object.keys(result).length === 0;

          let message;
          if (pass) {
            message = `Expected node: ${fmtBlock(actual)} to not match node: ${fmtBlock(expected)} but no diff was found`;
          } else {
            message = `Expected node: ${fmtBlock(actual)} to match node: ${fmtBlock(expected)} but found diff: ${fmtBlock(result)}`;
          }

          return { pass, message };
        }
      }
    }
  });
});
