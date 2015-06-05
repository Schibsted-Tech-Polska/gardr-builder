[![Build Status](https://travis-ci.org/Schibsted-Tech-Polska/gardr-builder.svg)](https://travis-ci.org/Schibsted-Tech-Polska/gardr-builder) [![Coverage Status](https://coveralls.io/repos/Schibsted-Tech-Polska/gardr-builder/badge.svg)](https://coveralls.io/r/Schibsted-Tech-Polska/gardr-builder)

# Garðr Builder

This command line tool allows for fast and easy building of a [Garðr](http://gardr.github.io/) project with optional plugins.


## Prequisitions 

* Node.js version 0.12.0 or higher
* npm in version 2.0.0 or higher.


## Installation

Clone this repository into whatever directory you like and run ```npm install``` command inside cloned directory.

## Configuration

Go to ```/config``` directory and create files there:

```ext-plugins-default.txt``` - plugins that are loaded into ext by default

```host-plugins-default.txt``` - plugins that are loaded into host by default

```ext-allowed-domains.txt``` - domains that are allowed for ext by default


All those files should be a new line delimited lists. ```/config``` directory contains examples of them.


## Usage

Use this command to build the component: ```npm run make [host|ext|iframe] [options]```


Your built files will be placed inside ```/output``` directory. Global Gardr objects will be exposed as ```gardrHost``` and ```gardrExt```.


## Options

```minify``` - to additionally create minified version of a component

```plugins=[path]``` - project root relative path to plugins list file that should be used instead of ```./config/[host|ext]-plugins-default.txt```

```domains=[path]``` - project root relative path to allowed domains list file that should be used instead of ```./config/ext-allowed-domains-default.txt```
