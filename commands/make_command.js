/**
 * 
 */

module.exports = {
  command(args) {

    console.log("HELLO WORLD", args);
  },
  commandOptions: {
    requiredParameters: ['modelName', 'secondThing'],
    required: [
      {
        name: "modelName",
        validateFunction() {

        },
        message: 'you moron',
      }
    ],
    // regexValidation: /model/g,
    args: {
      // these are from that package link to package
      // const arg = require('arg'); <---
      // '-modelName': String,
      '--option': Number,
      // '--install': Boolean,
      // '-g': '--git',
      // '-y': '--yes',
      // '-i': '--install',
    }
  }
}