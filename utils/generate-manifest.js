const	fileSystem = require('fs');
const	path = require('path');
const manifest = require('../src/manifest.json');
const packageValues = require('../package.json');

// Generate the manifest file using the values from package.json
manifest.description = packageValues.description;
manifest.version = packageValues.version;

fileSystem.writeFileSync(
  path.join(__dirname, '../build/manifest.json'),
  JSON.stringify(manifest)
);
