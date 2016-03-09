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
const express = require('express');
const router = express();
const server = require('http').Server(router);
const io = require('socket.io')(server);

/**
 * @constructor
 * @param {Object} routes A map containing any static
 * directories that should be added as middleware.
 */
function SocketServer(routes) {
  this.sockets = io;
  routes['staticDirs'].map(function(staticDir) {
    router.use(staticDir, express['static'](__dirname + staticDir + '/'));
  });
  this.router = router;
  this.server = server;
}

/**
 * Boots up server.
 * @param {number} port
 */
SocketServer.prototype.listen = function listen(port) {
  console.info('Server started on port ' + port);
  this.server.listen(port);
};

/** @type {SocketServer} **/
module.exports = SocketServer;
