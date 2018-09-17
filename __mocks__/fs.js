const path = require('path');

const fs = jest.genMockFromModule('fs');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null);
function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null);
  for (const file in newMockFiles) {
    const dir = path.dirname(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(path.basename(file));
  }
}

let mockFilesWithContent = Object.create(null);

function __setMockFilesWithContent(newMockFiles) {
  mockFilesWithContent = Object.create(null);

  Object.keys(newMockFiles).forEach((filePath) => {
    mockFilesWithContent[filePath] = newMockFiles[filePath];
  });
}



// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
function readdirSync(directoryPath) {
  return mockFiles[directoryPath] || [];
}

function readFileSync(filePath) {
  return mockFilesWithContent[filePath] || undefined;
}

fs.__setMockFiles = __setMockFiles;
fs.__setMockFilesWithContent = __setMockFilesWithContent;
fs.readdirSync = readdirSync;
fs.readFileSync = readFileSync;

module.exports = fs;
