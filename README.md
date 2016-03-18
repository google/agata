##agata

A simple UI layer over the components necessary to read hit logs for GAv4 on
Android devices. An **A**ndroid **GA** **T**ag **A**ssistant, if you will.

### Dependencies
Apart from the npm dependencies listed in package.json, this app relies on adb (Android Debug Bridge).

This can be installed either together with Android Studio or by installing the [SDK tools alone](http://developer.android.com/sdk/index.html#Other).

In short, we want:

- node/npm
- adb binary

### Setting up agata
Once your dependencies are set up and this repo cloned, you may want to copy your adb binary into `bin/adb` at the project's root:
   
    $ cd agata
    $ mkdir bin
    $ cp /path/to/adb bin/adb
               
The other option is to remove `./bin/` everywhere it appears from the file adb.js (if `adb` is in your `$PATH`). You would do this if you will run this app from the command line.
               
Lastly, install npm dependencies:
               
    $ npm install
                   
### Running agata
This app can run in two environments.
                   
**First**, as a standard node app:
                   
    $ node tagassistant.js
                       
**Second**, as a node-webkit standalone app, should you wish to package it for use by someone, without making them install node and other dependencies (like adb). This requires some set up, and has only been tested on Linux and MacOS, but [instructions are straightforward](https://github.com/nwjs/nw.js/wiki/how-to-package-and-distribute-your-apps).
                       
In order to minimize duplication of files, the `main` field in package.json is set to the value that node-webkit would expect, so running this app by entering `npm` into the command line does nothing.
                       
This is not an official Google product.
