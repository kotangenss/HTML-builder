const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const streamBundle = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

fs.readdir(stylesPath, { withFileTypes: true }, (err, data) => {
  if (err) throw err;

  for (let file of data) {
    if (file.isFile() && file.name.split('.')[1] === 'css') {
      const readableStreamBundle = fs.createReadStream(path.join(stylesPath, file.name), 'utf-8');

      readableStreamBundle.on('data', chunk => streamBundle.write(chunk + '\n'));
    }
  }
});
