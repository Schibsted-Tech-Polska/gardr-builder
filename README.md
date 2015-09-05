[![Build Status](https://travis-ci.org/Schibsted-Tech-Polska/gardr-builder.svg)](https://travis-ci.org/Schibsted-Tech-Polska/gardr-builder) [![Coverage Status](https://coveralls.io/repos/Schibsted-Tech-Polska/gardr-builder/badge.svg)](https://coveralls.io/r/Schibsted-Tech-Polska/gardr-builder)

# Garðr Builder

Created for fast and easy building of a [Garðr](http://gardr.github.io/) project with optional plugins.
It can be used as a node module or command line utility (CLI).


## Prequisitions 

* Node.js version 0.12.0 or higher
* npm in version 2.0.0 or higher (optional for CLI)


## Installation

For CLI, clone this repository into whatever directory you like and run ```npm install``` command inside cloned directory.

For node module, install it with ```npm install gardr-builder```.

## Node Module Usage

#### Example

```javascript
var gardrBuilder = require('gardr-builder')(/* config */);
gardrBuilder.host({
    minify: true,
    plugins: ['gardr-plugin-host-resize']
}).then(function() {
    console.log('host built!');
});
```

#### Configuration

Most of the time you don't need to touch main config (passed here as ```/* config */```), which controls things
like output directory etc., but if you need to, take a look at ```config.js``` file for default values.

#### Building

Use ```.host .ext .iframe``` methods of builder.

#### Options

```plugins: Array<String>``` - plugins list as array of strings (host/ext)

```allowedDomains: Array<String>``` - list of allowed domains as array of strings (ext)

```minify: Boolean``` - wether or not result should be minified (host/ext/iframe)

## CLI Usage

#### Example

```$> npm run make host minify```

#### Configuration

Go to ```/config``` directory and create files there:

```ext-plugins-default.txt``` - plugins that are loaded into ext by default

```host-plugins-default.txt``` - plugins that are loaded into host by default

```ext-allowed-domains.txt``` - domains that are allowed for ext by default


All those files should be a new line delimited lists. ```/config``` directory contains examples of them.

#### Building

Use this command to build the component: ```npm run make [host|ext|iframe] [options]```


Your built files will be placed inside ```/output``` directory. Global Gardr objects will be exposed as ```gardrHost``` and ```gardrExt```.


#### Options

```minify``` - to additionally create minified version of a component

```plugins=[path]``` - project root relative path to plugins list file that should be used instead of ```./config/[host|ext]-plugins-default.txt```

```allowedDomains=[path]``` - project root relative path to allowed domains list file that should be used instead of ```./config/ext-allowed-domains-default.txt```
