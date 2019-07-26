const fs = require('fs');
const lodash = require('lodash');

module.exports = {
	command(args) {
		const capitalizedModelName = lodash.capitalize(args.modelName);
		const underscoredModelName = lodash.snakeCase(args.modelName);

		const modelTemplate =
		`
		"use strict";

		const BaseManager = require('app/core/base-manager');

		class ${capitalizedModelName}Manager extends BaseManager {
			constructor(__params) {
				super('${underscoredModelName}', __params);
				// Set paranoid, auditlog, etc options here
				// this.paranoid = false;
			}

			defineAttributes(modelBuilder) {
				// Define attributes here
				//modelBuilder.defineText('htmldiff').disallow('update');
			}
		}

		module.exports = function() {
			return new ${capitalizedModelName}({}).buildSequelizeModel({});
		};
		`;

		return fs.writeFileSync(args.destinationDir, modelTemplate);

	},
	commandOptions: {
		required: [
			{
				name: 'modelName',
				message: 'modelName is required',
			},
			{
				name: 'destinationDir',
				message: 'destinationDir is required'
			}
		],
		args: []
	}
}
