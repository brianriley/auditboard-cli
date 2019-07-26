const chalk = require('chalk');

module.exports = {
	command(args) {
		const help = `
Auditboard CLI

Use this tool to create commands that will assist you while you build your application.
To view a list of available commands, you may use the "list" command:

auditboard list

		`;
		chalk.hex('#3156F3')(help, args);
	},
	commandOptions: {
		args:{}
	}
};
