const fs = require('fs');
const path = require('path');

const mock = require('mock-require');

const INPUT_PATH = path.resolve(__dirname, './index.fixtures.input.md');
const OUTPUT_PATH = path.resolve(__dirname, './index.fixtures.output.md');
const ACTUAL_PATH = path.resolve(__dirname, './index.actual.md');

describe('entrypoint', function() {
  let attacherSpy;
  let entrypoint;

  beforeEach(function() {
    attacherSpy = jasmine.createSpy('unified plugin attacher');
    mock('../plugin', attacherSpy);
    entrypoint = mock.reRequire('../');
  });

  afterEach(function() {
    if (fs.existsSync(ACTUAL_PATH)) {
      fs.unlinkSync(ACTUAL_PATH);
    }
  });

  it('invokes unified plugin attacher', function() {
    entrypoint(INPUT_PATH, ACTUAL_PATH, '0.1.0');

    expect(attacherSpy).toHaveBeenCalledTimes(1);
    expect(attacherSpy).toHaveBeenCalledWith({ version: '0.1.0' });
  });

  it('invokes unified plugin transformer', function() {
    const transformerSpy = jasmine.createSpy('unified plugin transformer');
    attacherSpy.and.returnValue(transformerSpy);

    entrypoint(INPUT_PATH, ACTUAL_PATH, '0.1.0');

    expect(transformerSpy).toHaveBeenCalledTimes(1);
    expect(transformerSpy).toHaveBeenCalledWith(
      jasmine.unist.nodeMatching({ type: 'root' }),
      jasmine.vfile.withHistoricalPath(INPUT_PATH)
     );
  });
});
