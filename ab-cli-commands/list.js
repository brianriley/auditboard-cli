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

const helpContent = `
This command displays a list of the available commands.

# Parameters:
* -p, --path Displays the absolute filepath to the corresponding file, for easy editing.

`;

module.exports = {
	command(args) {
		const list = [];
		const commandPaths = commandHelper.getCommandAbsolutePaths();
		
		for (const item of commandPaths) {
			const commandName = path.basename(item).replace(/_/g, ':').replace('.js', '');
			const moduleName = path.normalize(item).replace('.js', '');
			const { commandOptions } = require(moduleName);

			list.push({
				name: commandName,
				description: commandOptions.description || 'No help provided.',
				path: item,
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
		for (let element of list) {
			let name;
			if (element.name.includes(':')) {
				[ namespace, name ] = element.name.split(':');
			} else {
				namespace = '';
				name = element.name;
			}

			if (lastNamespace !== namespace) {
				listOutput += chalk.yellow(namespace) + '\n';
			}
			listOutput += '  ' + chalk.green(name.padEnd(maxCommandNameLength, ' '))
				+ chalk.white(element.description) + '\n';
			if (args.path && args.path === true) {
				listOutput += ' '.repeat(maxCommandNameLength + 2) + chalk.italic.gray(element.path) + '\n';
			}

			lastNamespace = namespace;
		}

		console.log(listOutput);
	},
	commandOptions: {
		help: helpContent,
		description: "Lists commands",
		args:{
			"--path": Boolean,
			"-p": "--path"
		}
	}
};
