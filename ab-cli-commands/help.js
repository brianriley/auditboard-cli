const chalk = require('chalk');
const commandHelper = require('../utils/command');
const path = require('path');
const marked = require('marked');
const TerminalRenderer = require('marked-terminal');

marked.setOptions({
  // Define custom renderer
  renderer: new TerminalRenderer()
});

module.exports = {
	command(args) {
		const commandPaths = commandHelper.getCommandAbsolutePaths();
		for (const item of commandPaths) {
			const itemCommandName = path.basename(item).replace('_', ':').replace('.js', '');
			const itemModuleName = path.normalize(item).replace('.js', '');

			if (itemCommandName === args.commandName) {
				const { commandOptions } = require(itemModuleName);
				console.log(marked(commandOptions.help));
				break;
			}
		}
	},
	commandOptions: {
		required: [
			{
				name: "commandName", // <-- this value will be users
				message: 'You need a command name to create a command... duh', // <-- failure message if param does not exist
			},
		],
		help: `
Auditboard CLI

Use this tool to create commands that will assist you while you build your application.
To view a list of available commands, you may use the "list" command:

auditboard list

And other great command that you'll create!
		`,
		args:{}
	}
};
