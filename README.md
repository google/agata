##agata

A simple UI layer over the components necessary to read hit logs for GAv4 on
Android devices (adb, measurement protocol). An Android GA Tag Assistant, if you will.

This app can run in two environments. 
First, as a standard node app:

    $ npm install
    $ node tagassistant.js

Second, as a node-webkit standalone app, should you wish to package it for use by someone, without making them install node and other dependencies. This requires some set up, and has only been tested on Linux and MacOS, but [instructions are straightforward](https://github.com/nwjs/nw.js/wiki/how-to-package-and-distribute-your-apps).

In order to minimize duplication of files, the "main" field in package.json is set to the value that node-webkit would expect, and running "npm" from the command line will therefore do nothing.

This is not an official Google product.
