// Copyright 2016 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////////

const adb = require('../adb');
const gaparser = new (require('../gaparser'))();
const gui = global.window.nwDispatcher.requireNwGui();

var adbStatus,
  statusHandlers = [];
adb.logcat.on('error', function(e) {
  if (e.errno == 'ENOENT') {
    adbStatus = 'ADB was not found';
  }
});

/**
 * Attempts to set log-level for GAv4 logs to DEBUG and then to bind the
 * spawned logcat process to the parsing utility. Returns an error status
 * if this fails.
 * @return {string|undefined}
 */
exports.init = function init() {
  return adb.setProp('log.tag.GAv4', 'DEBUG').then(function pipeLogcat() {
    adb.logcat.stdout.pipe(gaparser);
  }, function checkConnectionError(err) {
    if (err.indexOf('no devices') >= 0) {
      adbStatus = 'No devices connected!';
    }
    statusHandlers.forEach(function(handler) {
      handler.call(null, adbStatus);
    }); 
  });
};

/**
 * Attempts to simulate a clean install from the Play Store, clearing app data
 * and, on success, broadcasting an INSTALL_REFERRER.
 * @param {struct} details May contain a "package", "referrer", and "installer"
 * (corresponding respectively, to the package, extra string, and intent to
 * broadcast.
 */
exports.simulateInstall = function(details) {
  adb.clearData(details['package']).then(function broadcastInstall() {
    adb.install(details['package'], details.referrer, details.installer);
  });
};

/**
 * Allow addition of external handlers to gaparser data
 * events, and for the pushing of adb status updates. Used by
 * angular-space code.
 * @param {string} topic Which kind of update.
 * @param {Function} handler Update-handler.
 */
exports.on = function(topic, handler) {
  if (topic == 'data') {
    gaparser.on('data', handler);
  } else if (topic == 'status') {
    statusHandlers.push(handler);
    statusHandlers.forEach(function(handler) {
      handler.call(null, adbStatus);
    });
  }
};

if (process.platform == 'darwin') {
  var macMenu = new gui.Menu({'type': 'menubar'});
  macMenu.createMacBuiltin('Android Tag Assistant');
  gui.Window.get().menu = macMenu;
}
