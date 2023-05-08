const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const stream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const rl = readline.createInterface({ input, output });

console.log('Введите текст: ');

rl.on('SIGINT', () => {
  console.log('До новых встреч 🙃');
  process.exit();
});

rl.on('line', (data) => {
  if (data == 'exit') {
    console.log('До новых встреч 🙃');
    rl.close();
  } else {
    stream.write(data + '\n');
    console.log(`Ваш текст: «${data}» записан`);
    console.log('Напишите что-нибудь ещё:');
  }
});