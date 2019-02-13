const { EOL } = require('os');
const util = require('util');

const assert = require('mdast-util-assert');
const diff = require('unist-diff');
const indent = require('indent-string');
const inspect = require('unist-util-inspect').noColor;
const is = require('unist-util-is');

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
          return `<unist.nodeMatching ${util.inspect(test)}>`
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
          const message = `Expected test ${util.inspect(expected)} to ${pass ? 'fail' : 'succeed'} for node:${EOL}${inspect.noColor(actual)}.`;
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

          const formattedActual = indent(`${EOL}${inspect(actual)}${EOL}`, 2);
          let message;
          if (pass) {
            const formattedMatch = indent(`${EOL}${inspect(match)}`, 2)
            message = `Expected test ${util.inspect(expected)} to fail for a descendent of node:${formattedActual}but found:${formattedMatch}`;
          } else {
            message = `Expected test ${util.inspect(expected)} to succeed for a descendent of node:${formattedActual}`;
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
          const formattedActual = `${EOL}${indent(inspect(actual), 2)}${EOL}`;
          const formattedExpected = `${EOL}${indent(inspect(expected), 2)}${EOL}`;

          if (pass) {
            message = `Expected node:${formattedActual}to not match node:${formattedExpected}${EOL}but no diff was found`;
          } else {
            const formattedDiff = `${EOL}${indent(util.inspect(result, { depth: null }), 2)}`;
            message = `Expected node:${formattedActual}to match node:${formattedExpected}but found diff:${formattedDiff}`;
          }

          return { pass, message };
        }
      }
    }
  });
});
