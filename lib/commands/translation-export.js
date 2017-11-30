/* eslint-env node */
const XLSX = require('xlsx');
const fs = require('fs');

module.exports = {
  name: 'translations:export',
  description: 'Export ember-i18n translations',
  works: 'insideProject',

  run() {
    const csv = exportTranslations();
    this.ui.write(csv);
  },
};

function exportTranslations() {
  const en = loadTranslationFromFile('app/locales/en/translations.js');
  const zh = loadTranslationFromFile('app/locales/zh/translations.js');
  const translationKeys = mergeArrays(extractKeys(en), extractKeys(zh));
  const translationsExtracted = extractTranslations(translationKeys, [en, zh]);
  const sheet = XLSX.utils.aoa_to_sheet(translationsExtracted);
  const csv = XLSX.utils.sheet_to_csv(sheet, {
    FS: '|'
  });
  return csv;
}

function loadTranslationFromFile(file) {
  const contents = fs.readFileSync(file, 'utf-8');
  const stringified = contents
    .slice(contents.indexOf('{'), contents.lastIndexOf('}') + 1) // extract everything inside {...}
    .replace(/,\s+}/g, '}'); // remove trailing commas
  return JSON.parse(stringified);
}

function mergeArrays(array1, array2) {
  return array1.concat(array2.filter(item => !array1.includes(item)));
}

function extractTranslations(keys, [en, zh]) {
  if (!Array.isArray(keys)) {
    return [];
  }
  return keys.map(key => [
    key,
    deepFind(en, key) || '',
    deepFind(zh, key) || ''
  ]);
}

function extractKeys(object = {}) {
  const keys = Object.keys(object);
  if (!Array.isArray(keys)) {
    return [];
  }
  return keys.reduce((result, key) => {
    const value = object[key];
    if (typeof value === 'string' && key) {
      result.push(key);
    } else {
      const internalKeys = extractKeys(value).map(internalKey => `${key}.${internalKey}`);
      result = result.concat(internalKeys);
    }
    return result;
  }, []);
}

function deepFind(obj, path) {
  let paths = path.split('.'),
    current = obj,
    i;

  for (i = 0; i < paths.length; ++i) {
    if (typeof current[paths[i]] === 'undefined') {
      return undefined;
    } else {
      current = current[paths[i]];
    }
  }
  return current;
}
