const fs = require('fs');
const path = require('path');
const promises = require('fs/promises');

const stylesPath = path.join(__dirname, 'styles');
const componentsPath = path.join(__dirname, 'components');
const assetsPath = path.join(__dirname, 'assets');
const assetsCopyPath = path.join(__dirname, 'project-dist/assets');
const projectDistPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');

fs.mkdir(projectDistPath, { recursive: true }, err => {
  if (err) throw err;

  fs.readdir(stylesPath, { withFileTypes: true }, (err, data) => {
    if (err) throw err;

    const streamBundleStyles = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

    for (let file of data) {
      if (file.isFile()) {
        const readableStreamBundle = fs.createReadStream(path.join(stylesPath, file.name), 'utf-8');

        readableStreamBundle.on('data', chunk => streamBundleStyles.write(chunk + '\n'));
      }
    }
  });

  fs.readdir(projectDistPath, { withFileTypes: true }, (err, data) => {
    if (err) throw err;

    fs.mkdir(assetsCopyPath, { recursive: true }, err => {
      if (err) throw err;

      fs.readdir(assetsPath, { withFileTypes: true }, (err, data) => {
        if (err) throw err;

        for (let directory of data) {
          let directoryPath = path.join(__dirname, `project-dist/assets/${directory.name}`);
          let pathFromDirectory = path.join(__dirname, `assets/${directory.name}`);

          fs.rmdir(directoryPath, { recursive: true }, (err) => {
            if (err) throw err;

            fs.mkdir(directoryPath, { recursive: true }, err => {
              if (err) throw err;

              fs.readdir(pathFromDirectory, { withFileTypes: true }, (err, data) => {
                if (err) throw err;

                for (let file of data) {
                  if (file.isFile()) {
                    let pathFromFile = path.join(path.join(__dirname, `assets/${directory.name}`, file.name));
                    let pathToFile = path.join(path.join(__dirname, `project-dist/assets/${directory.name}`, file.name));

                    promises.copyFile(pathFromFile, pathToFile);
                  }
                }
              });
            });
          });
        }
      });
    });
  });

  (async () => {
    const readTemplate = await promises.readFile(templatePath, 'utf-8');
    const arrayComponents = await promises.readdir(componentsPath, { withFileTypes: true });
    let copyTemplateContent = readTemplate;

    for (let component of arrayComponents) {
      let componentName = component.name.split('.')[0];
      let componentExtension = component.name.split('.')[1];

      if (component.isFile() && componentExtension == 'html') {
        let componentContent = await promises.readFile(path.join(componentsPath, component.name), 'utf-8');

        regexp = new RegExp(`{{${componentName}}}`);
        copyTemplateContent = copyTemplateContent.replace(regexp, componentContent);
        await promises.writeFile(path.join(projectDistPath, 'index.html'), copyTemplateContent);
      }
    }
  })();
});
