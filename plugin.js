const assertEqual = require('assert').equal;

const assertTree = require('mdast-util-assert');
const is = require('unist-util-is');
const map = require('unist-util-map');
const visit = require('unist-util-visit');

const ASSERTION_STRING_TYPE = 'string';
const ASSERTION_STRING_ERROR = 'The `version` property should be a string.';

const TYPE_HEADING = 'heading';
const TYPE_LINK_REFERENCE = 'linkReference';
const TYPE_DEFINITION = 'definition';
const TYPE_TEXT = 'text';

const VALUE_UNRELEASED = 'Unreleased';

const TEST_UNRELEASED_LINK_REFERENCE = { type: TYPE_LINK_REFERENCE, label: VALUE_UNRELEASED };
const TEST_UNRELEASED_HEADING =
  node => node.type === TYPE_HEADING
       && Array.isArray(node.children)
       && node.children.find(child => is(TEST_UNRELEASED_LINK_REFERENCE, child));
const TEST_NODE_TO_DUPLICATE = [TEST_UNRELEASED_HEADING, { type: TYPE_DEFINITION, label: VALUE_UNRELEASED }];

const URL_PATH_SEPARATOR = '/';
const URL_RANGE_SEPARATOR = '...';
const URL_VERSION_PREFIX = 'v';

function attacher({ version }) {
  assertEqual(typeof version, ASSERTION_STRING_TYPE, ASSERTION_STRING_ERROR);

  function transformer(tree, file) {
    assertTree(tree);
    visit(tree, TEST_NODE_TO_DUPLICATE, visitor);
  }

  function visitor(node, index, parent) {
    const clone = map(node, replace);

    if (node.type === TYPE_DEFINITION) {
      updateURLs(node, clone);
    }

    parent.children.splice(index + 1, 0, clone)
    return index + 2; // skip over newly inserted clone node
  }

  function replace(node) {
    if (node.type === TYPE_LINK_REFERENCE || node.type === TYPE_DEFINITION) {
      return Object.assign({}, node, { identifier: version, label: version });
    } else if (node.type === TYPE_TEXT) {
      return Object.assign({}, node, { value: version });
    } else {
      return Object.assign({}, node);
    }
  }

  function updateURLs(unreleased, bumped) {
    const parts = unreleased.url.split(URL_PATH_SEPARATOR);
    const comparison = parts.pop();
    const [old, head] = comparison.split(URL_RANGE_SEPARATOR);

    const prefixedVersion = `${URL_VERSION_PREFIX}${version}`
    const unreleasedComparison = `${prefixedVersion}${URL_RANGE_SEPARATOR}${head}`;
    const bumpedComparison = `${old}${URL_RANGE_SEPARATOR}${prefixedVersion}`;

    unreleased.url = [...parts, unreleasedComparison].join(URL_PATH_SEPARATOR);
    bumped.url = [...parts, bumpedComparison].join(URL_PATH_SEPARATOR);
  }

  return transformer;
}

module.exports = attacher;
