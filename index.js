const vfile = require('to-vfile');
const unified = require('unified');
const parse = require('remark-parse');
const stringify = require('remark-stringify');

function attacher({ version }) {
  function transformer(tree, file) {
    console.log(file, tree);
  }

  console.log(version);
  return transformer;
}

function bumpVersion(inputPath, outputPath, version) {
  const pipeline = unified()
    .use(parse)
    .use(attacher, { version })
    .use(stringify);
  
  const input = vfile.readSync(inputPath);
  const output = pipeline.processSync(input);
  output.path = outputPath;
  vfile.writeSync(output);
}

module.exports = bumpVersion;
