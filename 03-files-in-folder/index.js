const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, data) => {
  if (err) throw err;
  
  for (let file of data) {
    if (file.isFile()) {
      let name = file.name.split('.')[0];
      let extension = file.name.split('.')[1];

      fs.stat(path.join(folderPath, `${file.name}`), (err, stats) => {
        console.log(name + ' - ' + extension + ' - ' + (stats.size / 1024).toFixed(3) + 'kb');
      });
    }
  }
});