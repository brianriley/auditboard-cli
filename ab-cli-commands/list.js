const chalk = require('chalk');
const commandHelper = require('../utils/command');
const path = require('path');

function compare( a, b ) {
	if ( a.name.indexOf(':') > -1 || b.name.indexOf(':') > -1) {
		if (a.name.indexOf(':') > -1 && b.name.indexOf(':') === -1) {
			return 1;
		}
		if (a.name.indexOf(':') === -1 && b.name.indexOf(':') > -1) {
			return -1;
		}
	}
	if ( a.name < b.name ) {
		return -1;
	}
	if ( a.name > b.name ) {
		return 1;
	}
	return 0;
}

module.exports = {
	command(args) {
		const list = [];
		const commandPaths = commandHelper.getCommandAbsolutePaths();
		
		for (const item of commandPaths) {
			const commandName = path.basename(item).replace('_', ':').replace('.js', '');
			const moduleName = path.normalize(item).replace('.js', '');
			const { commandOptions } = require(moduleName);

			list.push({
				name: commandName,
				description: commandOptions.description || 'No help provided.',
			});
		}
		list.sort(compare);
		console.log(chalk.yellow('List of available commands:'));

		let maxCommandNameLength = 0;
		list.forEach((element) => {
			if (maxCommandNameLength < element.name.length) {
				maxCommandNameLength = element.name.length;
			}
		});
		maxCommandNameLength += 3;

		let listOutput = '\n';
		let lastNamespace = '';
		let namespace = '';
		for (element of list) {
			if (element.name.indexOf(':') > -1) {
				[ namespace, name ] = element.name.split(':');
			} else {
				namespace = '';
				name = element.name;
			}

			if (lastNamespace !== namespace) {
				listOutput += chalk.yellow(namespace) + '\n';
			}
			listOutput += '  ' + chalk.green(element.name.padEnd(maxCommandNameLength, ' '))
				+ chalk.white(element.description) + '\n';

			lastNamespace = namespace;
		}

		console.log(listOutput);
	},
	commandOptions: {
		description: "Lists commands",
		args:{}
	}
};
