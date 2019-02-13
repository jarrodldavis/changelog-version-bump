const u = require('unist-builder');

module.exports.input = () => u('root', [
  u('heading', { depth: 1 }, [
    u('text', 'Changelog')
  ]),
  u('heading', { depth: 2 }, [
    u('linkReference', {
      identifier: 'unreleased',
      label: 'Unreleased',
      referenceType: 'shortcut'
    }, [
      u('text', 'Unreleased')
    ])
  ]),
  u('definition', {
    identifier: 'unreleased',
    label: 'Unreleased',
    title: null,
    url: 'https://github.com/jarrodldavis/changelog-version-bump/compare/v0.0.1...HEAD'
  })
]); 

module.exports.output = () => u('root', [
  u('heading', { depth: 1 }, [
    u('text', 'Changelog')
  ]),
  u('heading', { depth: 2 }, [
    u('linkReference', {
      identifier: 'unreleased',
      label: 'Unreleased',
      referenceType: 'shortcut'
    }, [
      u('text', 'Unreleased')
    ])
  ]),
  u('heading', { depth: 2 }, [
    u('linkReference', {
      identifier: '0.1.0',
      label: '0.1.0',
      referenceType: 'shortcut'
    }, [
      u('text', '0.1.0')
    ])
  ]),
  u('definition', {
    identifier: 'unreleased',
    label: 'Unreleased',
    title: null,
    url: 'https://github.com/jarrodldavis/changelog-version-bump/compare/v0.1.0...HEAD'
  }),
  u('definition', {
    identifier: '0.1.0',
    label: '0.1.0',
    title: null,
    url: 'https://github.com/jarrodldavis/changelog-version-bump/compare/v0.0.1...v0.1.0'
  }),
]);
