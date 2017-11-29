* This addon is under development and doesn't have any configuration settings for now. Use it on your own risk. *


# ember-i18n-import-export

> An ember-i18n plugin to import/exsport translations

This addon allows you to import/export `ember-i18n` translation from/to `.csv` and `.xslx` files.

## Installation

Install `ember-i18n` before installing this addon.

```
ember install ember-i18n-import-export
```

## Usage

You can either export data to `.csv` or import data from `.xslx`.

### Export to `.scv`

```
ember translation:export
```

You will see comma separated content of `.scv` file.
To save translation in a file use system tools like:

```
ember translation:export > ~/translations.csv
```

### Import from `.xslx`

```
ember translation:export ember translations:import -f <path-to-xlsx-file>
```

Where `<path-to-file>` is a path to .xlsx file with translations.

Example: `ember translations:import -f ~/translations.xlsx`
