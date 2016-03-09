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

const Transform = require('stream').Transform;
const extend = require('util').inherits;
const util = require('./util');

extend(GAParser, Transform);

/**
 * A Transform stream for parsing logcat output for GA hits.
 * Outputs hit logs as UTF-8-encoded strings (unlike Readable's default
 * behavior).
 *
 * @extends {stream.Transform}
 * @constructor
 */
function GAParser() {
  Transform.call(this, { decodeStrings: false });
  this.setEncoding('utf8');
}

/**
 * Passes logcat stdout chunks to parsing utility.
 * @param {string} data Provided on write() by source stream.
 * @param {string} encoding
 * @param {Function} callback Class-required callback once chunk is processed.
 * @override
 */
GAParser.prototype._transform = function(data, encoding, done) {
  var hitsPushed = util.extractGA(data).map(this.push, this);
  done();
};

/** @type {Function} **/
module.exports = GAParser;

