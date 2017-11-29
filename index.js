/* eslint-env node */
'use strict';
const commands = require('./addon/commands');

module.exports = {
  name: 'ember-i18n-import-export',
  includedCommands() {
    return commands;
  },

  afterInstall() {
    return this.addPackage('xlsx'); // is a promise
  }
};
