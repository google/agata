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
const util = require('../util');
const Promise = require('promise');

describe('util', function() {
  describe('execute', function() {
    it('should return a promise', function(done) {
      assert(util.execute('ls') instanceof Promise);
      done();
    });

    it('should resolve to the process\' stdout', function(done) {
      util.execute('echo hello').then(function(stdout) {
        assert(stdout === 'hello\n');
        done();
      });
    });
  });

  describe('spawn', function() {
    var nonterminate = util.spawn('vi');
    after(function() {
      nonterminate.kill();
    });

    it('should return an object with 3 stdio streams', function() {
      nonterminate = util.spawn('vi');
      assert(nonterminate.stdio.length === 3);
    });

    it('should have a numeric PID', function() {
      assert(typeof nonterminate.pid === 'number');
    });

  });

  describe('extractGA', function() {
    it('should return all logs of GAv4 hit-delivery requests', function() {
      var test = 'Hit delivery requested: foo\n ' +
          'Hit delivery requested: bar\n';
      var results = util.extractGA(test);
      console.info(results);
      assert(results.length === 2);
      assert(results[0] === 'Hit delivery requested: foo');
      assert(results[1] === 'Hit delivery requested: bar');
    });

    it('should return [] if there are no GAv4 hit-delivery requests',
       function() {
         var test = 'fail';
         var results = util.extractGA(test);
         assert(Array.isArray(results) && results.length === 0);
       });
  });
});

