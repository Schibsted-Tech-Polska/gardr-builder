[![Build Status](https://travis-ci.org/Schibsted-Tech-Polska/gardr-builder.svg)](https://travis-ci.org/Schibsted-Tech-Polska/gardr-builder)

# Garðr Builder

This command line tool allows for fast and easy building of a [Garðr](http://gardr.github.io/) project with optional plugins.


## Prequisitions 

* Node.js version 0.12.0 or higher

For convinience, make sure you have npm in version 2.0.0 or higher.


## Installation

Clone this repository into whatever directory you like and run ```npm install``` command inside cloned directory.

## Configuration

Go to ```/config``` directory and create files there:

```ext-plugins-default.txt``` - plugins that are loaded into ext by default

```host-plugins-default.txt``` - plugins that are loaded into host by default

```ext-allowed-domains``` - domains that are allowed for ext by default


All those files should be a new line delimited lists. ```/config``` directory contains examples of them.


## Usage

Use this command to build the component: ```npm run make [host|ext|iframe] [options]```

If your npm version is lower than 2.0.0, use this command instead: ```node cli.js [host|ext|iframe] [options]```

Your built files will be placed inside ```/output``` directory.


## Options

```minify``` - to additionally create minified version of a component

```plugins=[path]``` - project root relative path to plugins list file that should be used instead of ```./config/[host|ext]-plugins-default.txt```

```domains=[path]``` - project root relative path to allowed domains list file that should be used instead of ```./config/ext-allowed-domains-default.txt```
