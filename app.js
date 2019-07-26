#!/usr/bin/env node

const figlet = require('figlet');
const arg = require('arg');
const commandHelper = require('./utils/command');
const path = require('path');
const chalk = require('chalk');

const introMessage = figlet.textSync('AuditBoard', {
	font: 'Slant',
	horizontalLayout: 'default',
	verticalLayout: 'default',
});
console.log(introMessage);

function parseArgs(rawArgs, commandOptions) {
	const args = arg(commandOptions.args, { argv: rawArgs.slice(3) });

	// loop through args._ and extract non '--' things
	const result = {};
	const failures = [];
	let index = 0;

	// if there are required parameters
	if (commandOptions.required && commandOptions.required.length) {
		// if there is no params provided and there are non required
		if (!args._.length && commandOptions.required && !commandOptions.required.length) {
			failures.push(...commandOptions.required.map(r => r.message));
		}

		for (const key of Object.keys(commandOptions.required)) {
			// if there are required params but aren't provided
			if (!args._[index] && commandOptions.required[index]) {
				failures.push(commandOptions.required[index].message || `Require parameter missing: ${commandOptions.required[index].name}`);
			}
			result[commandOptions.required[index].name] = args._[index];

			index++;
		}
	}

	// parse optional args
	for (const key of Object.keys(args)) {
		if (key.startsWith('--')) {
			result[key.replace('--', '')] = args[key];
		}
	}

	// throw errors
	if (failures.length) {
		console.log(chalk.red(`There were ${failures.length} error${failures.length === 1 ? '' : 's'} while running your command...`));
		for (let i = 0; i < failures.length ; i++) {
			console.log(chalk.black.bgWhite.bold(`${i+1})`), chalk.red(failures[i]));
		}

		process.exit(1);
	}

	return result;
}

function parseCommand(commandString) {
	const commandPaths = commandHelper.getCommandAbsolutePaths();

	for (const item of commandPaths) {
		const commandName = path.basename(item).replace('_', ':').replace('.js', '');
		const moduleName = path.normalize(item).replace('.js', '');
		if (commandString === commandName) {
			// found the command
			return require(moduleName);
		}
	}

	console.log(chalk.red("Error: command ") + chalk.bold(commandString) + chalk.red(" not found."));
	process.exit(1);
}

async function cli(rawArgs) {
	let inputCommandString = rawArgs[2];
	if (!inputCommandString) {
		inputCommandString = 'list';
	}
	const { command, commandOptions } = parseCommand(inputCommandString);
	const options = parseArgs(rawArgs, commandOptions);

	try {
		let successMessage = await command(options);
		// if not list or test then we want to log something 
		if (!['test', 'list', 'help'].includes(inputCommandString)) {
			// default message
			successMessage = successMessage || `Your command ${inputCommandString} ran successfully!`;
			console.log(chalk.green(successMessage));
		}
	}
	catch (err) {
		// do something else with error handling
		console.error(err);
		process.exit(1);
	}
};

cli(process.argv);
