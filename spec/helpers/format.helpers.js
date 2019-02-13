const { EOL } = require('os');
const util = require('util');

const indent = require('indent-string');
const inspect = require('unist-util-inspect').noColor;
const is = require('unist-util-is');

const INSPECT_INDENTATION_COUNT = 2;

function fmtInline(obj) {
  return util.inspect(obj, { breakLength: Infinity });
}

function fmtBlock(obj) {
  let str;
  if (is(null, obj)) {
    str = inspect(obj, INSPECT_INDENTATION_COUNT);
  } else {
    str = util.inspect(obj, { depth: null });
  }
  return `${EOL}${indent(str, INSPECT_INDENTATION_COUNT)}${EOL}`;
}

module.exports = { fmtInline, fmtBlock };
