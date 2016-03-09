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

const assert = require('assert');
const gaparser = new (require('../gaparser'))();
const stream = require('stream');

describe('GAParser', function() {
  it('should be a stream.Transform', function() {
    assert(gaparser instanceof stream.Transform);
  });

  it('should only emit data as GAv4 hits arrive.', function() {
    var countData = 0;
    gaparser.on('data', function() {
      countData++;
    });
    gaparser.write('Hit delivery requested: foo\n');
    gaparser.write('fail');
    gaparser.write('Hit delivery requested: bar\n');
    assert(countData == 2);
  });
});

