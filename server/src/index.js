require('@nlpjs/basic').dockStart();
const server = require('./server');

async function main() {
  await server.start();
}

main();
