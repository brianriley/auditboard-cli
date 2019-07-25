module.exports = {
  command(args) {

    console.log("HELLO WORLD", args);
  },
  commandOptions: {
    // requiredParameters: ['modelName', 'secondThing'],
    required: [
      {
        name: "modelName",
        message: 'you moron',
      },
      {
        name: 'something',
        message: 'you moron 2x',
      }
    ],
    // regexValidation: /model/g,
    args: {
      // these are from that package link to package
      // const arg = require('arg'); <---
      // '-modelName': String,
      '--option': Number,
      // '--install': Boolean,
      '-o': '--option',
      // '-y': '--yes',
      // '-i': '--install',
    }
  }
}