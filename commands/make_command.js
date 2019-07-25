/**
 * 
 */

module.exports = {
  command(args) {
    console.log("HELLO WORLD", args);
  },
  commandOptions: {
    requiredParameters: ['modelName'],
    // regexValidation: /model/g,
    args: {
      // these are from that package link to package
      // const arg = require('arg'); <---
      // '-modelName': String,
      // '--yes': Boolean,
      // '--install': Boolean,
      // '-g': '--git',
      // '-y': '--yes',
      // '-i': '--install',
    }
  }
}