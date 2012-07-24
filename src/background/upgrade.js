"use strict";

/*
* @description Migrates data from previous versions of Validity.
*/

var validity = (function(validity) {
	var upgrade = {},
		version = '@version@',
		prevVersion = parseFloat(localStorage['version']) || 0;

		//	Expand major.minor.bugfix version number to array.
		upgrade.explodeVersion = function(versionString) {
			var version = versionString.split('.');

			//	Parse each point into an integer
			version.forEach(function(value, index, array) {
				array[index] = parseInt(array[index]);
			});

			return version;
		}

		upgrade.isNewVersion = function(newVersion, oldVersion) {
			var returnValue = false;

			//	Explode version string to arrays.
			newVersion = upgrade.explodeVersion(newVersion);
			oldVersion = upgrade.explodeVersion(oldVersion);

			newVersion.some(function(value, index, array) {
				if (newVersion[index] > oldVersion[index]) {
					returnValue = true;
					//	Break out and return true from method.
					return true;
				}
				else if (newVersion[index] < oldVersion[index]) {
					//	Break out and return false from method.
					returnValue = false;
					return true;
				}
				//	Else continue to next index or return false from method.
			});

			return returnValue;
		}

		//	Migrate options from localStorage strings to JSON.
		upgrade.migrate = function(version, prevVersion) {
			var dataTypes,
				options = {};

			//	If this isn't the first run of a new version
			//	or we already have localStorage['options'], return early.
			if (upgrade.isNewVersion(version, prevVersion) === false || window.localStorage['options']) {
				return false;
			}

			dataTypes = {
				'string': [
					'validator'
				],
				'array': [
					'enableHosts',
					'validateHosts'
				],
				'bool': [
					'collapseResults'
				]
			};

			//	Migrate string type options.
			dataTypes.string.forEach(function(element, index, array) {
				options[element] = window.localStorage[element];
			});

			//	Migrate array type options.
			dataTypes.array.forEach(function(element, index, array) {
				var array = window.localStorage[element].split(' ');
				options[element] = array;
			});

			//	Migrate boolean type options.
			dataTypes.bool.forEach(function(element, index, array) {
				options[element] = validity.util.toBool(window.localStorage[element]);
			});

			//	Store version number of new version in localStorage.
			if (version) {
				window.localStorage['version'] = version;
			}

			window.localStorage['options'] = JSON.stringify(options);
			return options;
		}

		validity.upgrade = upgrade;
		return validity;
})(validity || {});
