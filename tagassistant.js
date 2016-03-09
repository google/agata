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
'use strict';
const adb = require('./adb');
const gaparser = new (require('./gaparser'))();
const SocketServer = require('./socket-server');
const open = require('open');

var adbStatus;

const PORT = 8080;
const server = new SocketServer({
  staticDirs: ['/static', '/node_modules']
});
server.router.get('/', function(req, res) {
  res.sendFile(__dirname + '/static/index.html');
});
server.sockets.on('connection', function(socket) {
  socket.on('install', simulateInstall);
  socket.emit('status', adbStatus);
});

adb.logcat.on('error', function(e) {
  adbStatus = 'ADB was not found';
});

adb.setProp('log.tag.GAv4', 'DEBUG').then(function pipeLogcat() {
  adb.logcat.stdout.pipe(gaparser);
  gaparser.on('data', function(d) {
    server.sockets.emit('data', d);
  });
}, function checkConnectionError(err) {
  if (err.indexOf('no devices') >= 0) {
    adbStatus = 'No devices connected!';
  } else if (err.indexOf('command not found') >= 0) {
    adbStatus = 'ADB was not found.';
  }
});

server.listen(PORT);
open('http://localhost:' + PORT);


/**
 * Attempts to simulate a clean install from the Play Store, clearing app data
 * and, on success, broadcasting an INSTALL_REFERRER.
 * @param {struct} details May contain a "package", "referrer", and "installer"
 * (corresponding respectively, to the package, extra string, and intent to
 * broadcast.
 */
function simulateInstall(details) {
  adb.clearData(details['package']).then(function() {
    adb.install(details['package'], details.referrer);
  });
}
