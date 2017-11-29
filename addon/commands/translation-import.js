/* eslint-env node */
const XLSX = require('xlsx');
const fs = require('fs');

module.exports = {
  name: 'translations:import',
  description: 'Import ember-i18n translations',
  works: 'insideProject',

  availableOptions: [{
    name: 'file-to-import',
    type: String,
    description: '(Default: ~/translations.xlsx)',
    aliases: ['f']
  }],

  run(commandOptions) {
    if(!commandOptions.fileToImport){
      this.ui.writeLine('Usage:');
      this.ui.writeLine('    ember translations:import -f <path-to-file>');
      this.ui.writeLine('Where <path-to-file> is a path to .xlsx file with translations.');
      this.ui.writeLine('Example: ember translations:import -f ~/translations.xlsx');
      return;
    }
    this.ui.writeLine('Importing ember-i18n translations');
    importTranslations(commandOptions.fileToImport);
    this.ui.writeLine('Finished!');
  },
};

const locales = ['en', 'zh'];

function importTranslations(fileToImport) {
  const workbook = XLSX.readFile(fileToImport);
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // an array with parsed data
  const parsedTranslations = XLSX.utils.sheet_to_json(worksheet, {
    raw: true,
    header: ['key'].concat(locales),
    defval: ''
  });

  // object like {en: {...}, zh: {...}}
  const splittedTranslations = parsedTranslations.reduce((result, item) => {
    locales.forEach(locale => {
      const key = item.key;
      const value = item[locale];
      set(result, `${locale}.${key}`, value);
    });
    return result;
  }, {});

  Object.keys(splittedTranslations).forEach(locale => {
    const file = `app/locales/${locale}/translations.js`;
    const jsonString = JSON.stringify(splittedTranslations[locale], null, 2);
    fs.writeFileSync(file, `export default ${jsonString};`);
  });
}

// Sets object value using deep, dot-separated key.
// Example set({}, "foo.bar", 1) results in {foo: {bar: 1}}
function set(object, key, value) {
  const keys = String(key).split('.');
  if (keys.length > 1) {
    if (!object[keys[0]]) {
      object[keys[0]] = {};
    }
    set(object[keys[0]], keys.slice(1).join('.'), value);
  } else {
    object[keys[0]] = value;
  }
  return object;
}
