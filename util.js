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

const child = require('child_process');
const Promise = require('promise');
const format = require('util').format;

/**
 * A proxy to Node's child_process.exec method, with two additions:
 * 1) allows the use of printf-style format-strings and
 * 2) returns a promise (chainable)
 * @param {str...} formatString printf-style arguments.
 * @return {Promise}
 */
exports.execute = function(formatString) {
  var command = format.apply(null, arguments);
  var promise = new Promise(function(resolve, reject) {
    child.exec(command, function(err, stdout, stderr) {
      if (err) reject(stderr);
      else resolve(stdout);
    });
  });
  return promise;
};

/**
 * Allows creation of single process from a shell command.
 * @param {string} command Shell command to popen.
 * @return {ChildProcess}
 */
exports.spawn = function(command) {
  var commandArgs = command.split(' ');
  var spawnCmd = commandArgs.shift();
  return child.spawn(spawnCmd, commandArgs);
};

/**
 * Parses chunk for logcat entries that indicate GA hits and returns
 * newline-capped strings.
 * @param {string | Buffer | null} chunk Data from Readable stream.
 * @return {Array<string>}
 */
exports.extractGA = function(chunk) {
  var HIT_REGEX = /Hit delivery requested:.*/g;
  return (chunk && chunk.indexOf) ?
    chunk.match(HIT_REGEX) || [] : [];
}
