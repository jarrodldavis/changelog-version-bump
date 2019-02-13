const { EOL } = require('os');
const util = require('util');

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
    }
  });
});
