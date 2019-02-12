const is = require('unist-util-is');
const map = require('unist-util-map');
const visit = require('unist-util-visit');

const TYPE_HEADING = 'heading';
const TYPE_LINK_REFERENCE = 'linkReference';
const TYPE_DEFINITION = 'definition';
const TYPE_TEXT = 'text';

const VALUE_UNRELEASED = 'Unreleased';

const TEST_UNRELEASED_LINK_REFERENCE = { type: TYPE_LINK_REFERENCE, label: VALUE_UNRELEASED };
const TEST_NODE_TO_DUPLICATE = [
  node => node.type === TYPE_HEADING && node.children.find(child => is(TEST_UNRELEASED_LINK_REFERENCE, child)),
  { type: TYPE_DEFINITION, label: VALUE_UNRELEASED }
];

function attacher({ version }) {
  function transformer(tree, file) {
    visit(tree, TEST_NODE_TO_DUPLICATE, visitor);
  }

  function visitor(node, index, parent) {
    const clone = map(node, replace);
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

  return transformer;
}

module.exports = attacher;
