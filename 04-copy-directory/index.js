const fs = require('fs');
const path = require('path');
const promises = require('fs/promises');

const filesPath = path.join(__dirname, 'files');
const filesCopyPath = path.join(__dirname, 'files-copy');

fs.rm(filesCopyPath, { recursive: true }, (err) => {

  fs.mkdir(filesCopyPath, { recursive: true }, err => {
    if (err) throw err;
    copyFiles();
  });
});

function copyFiles() {
  fs.readdir(filesPath, { withFileTypes: true }, (err, data) => {
    if (err) throw err;

    for (let file of data) {
      if (file.isFile()) {
        let pathFromFile = path.join(filesPath, file.name);
        let pathToFile = path.join(filesCopyPath, file.name);

        promises.copyFile(pathFromFile, pathToFile)
      }
    }
  });
}