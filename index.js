const vfile = require('to-vfile');
const unified = require('unified');
const parse = require('remark-parse');
const plugin = require('./plugin');
const stringify = require('remark-stringify');

function bumpVersion(inputPath, outputPath, version) {
  const pipeline = unified()
    .use(parse)
    .use(plugin, { version })
    .use(stringify);
  
  const input = vfile.readSync(inputPath);
  const output = pipeline.processSync(input);
  output.path = outputPath;
  vfile.writeSync(output);
}

module.exports = bumpVersion;
