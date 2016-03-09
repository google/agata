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


var tagassistant;

if (typeof require != "undefined") {
  tagassistant = require('./tagassistant');
  tagassistant.init();
} else {
  tagassistant = io(location.origin);
}

angular.module('gata', ['ngMaterial'])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('orange');
  })
  .constant('tagassistant', tagassistant)
  .service('hitUtil', HitUtil)
  .controller('HitReceiver', ['tagassistant', '$scope', '$mdDialog', '$mdToast',
    'hitUtil', HitReceiver])
  .controller('HitDetailController', ['hit', 'hitUtil', HitDetailController])
  .directive('hitSummary', function HitSummaryDirectiveFactory() {
    return {
      restrict: 'EA',
      controller: 'HitReceiver',
      controllerAs: 'receiver',
      templateUrl: 'hit-summary.html'
    };
  });

/**
 * This service binds together our spawned processes and the rest of
 * the UI.
 * @constructor
 * @param {$scope} $scope Allows us to inform GA of new data available.
 * @param {$mdDialog} $mdDialog For showing hit details.
 * @param {$mdToast} $mdToast For providing updates from supporting processes.
 * @param {hitUtil} hitUtil Message-parsing utils.
 */
function HitReceiver(tagassistant, $scope, $mdDialog, $mdToast, hitUtil) {
  var self = this;

  this.hits = [];
  this.$mdDialog = $mdDialog;
  this.util = hitUtil;
  this.connecting = true;

  tagassistant.on('data', function(d) {
    $scope.$apply(function() { self.hits.push(hitUtil.parseHit(d)); });
  });

  tagassistant.on('status', function processAdbResponse(status) {
    self.connecting = false;
    if (status) {
      alertWithAction(status, 'Retry').then(function(response) {
        self.connecting = true;
      });
    }
  });

  function alertWithAction(status, action) {
    var toast = $mdToast.simple()
      .textContent(status)
      .action(action)
      .highlightAction(false)
      .position('bottom right')
      .hideDelay(0);
    return $mdToast.show(toast);
  }
}

/**
 * Pass Measurement Protocol hit object to our dialog template,
 * for rendering.
 * @param {$event} $event The click event triggering this call.
 * @param {hit} hit The MP hit object.
 */
HitReceiver.prototype.showHitDetail = function($event, hit) {
  var $mdDialog = this.$mdDialog;
  $mdDialog.show({
    clickOutsideToClose: true,
    locals: { 'hit': hit },
    controller: 'HitDetailController',
    controllerAs: 'detail',
    templateUrl: 'hit-detail.html',
    targetEvent: $event
  });
};

/**
 * Directive controller. Will get injected with local 'hit' object.
 * @param {hit} hit The hit hash for this detail modal.
 * @param {hitUtil} hitUtil Styling utilities for use by directive.
 * @constructor
 */
function HitDetailController(hit, hitUtil) {
  this.hit = hit;
  this.util = hitUtil;
}

/**
 * Route install simulation request to tagassistant module,
 * providing the package for which to run simulation, and an
 * AdWords auto-tag value as the simulated referrer for this
 * install.
 */
HitDetailController.prototype.simulateInstall = function() {
  var self = this;
  tagassistant.simulateInstall({
    'package': self.hit.aid,
    'referrer': 'gclid=Test-123'
  });
};

function HitUtil() {
  this.colorPalette = [
    '#2196f3',
    '#ff5722',
    '#4caf50',
    '#f44336',
    '#9c27b0',
    '#ff4081'
  ];
}

/**
 * Cleans up the output returned from logcat and transforms it into
 * an object of measurement protocol keys and values.
 * @param {data} data Raw data from LogCat.
 * @return {Object}
 */
HitUtil.prototype.parseHit = function parseHit(data) {
  var rawKeyValues = data.match(/\w+=.*/);
  if (rawKeyValues) {
    var hit = {};
    rawKeyValues[0].split(',').forEach(function(kv) {
      var pair = kv.trim().split('=');
      hit[pair[0]] = pair[1];
    });
    return hit;
  }
};

/**
 * Takes the sum of all character char codes and maps to
 * a color from the color palette, returning a CSS hash for
 * styling.
 * @param {string} str The string to map to a hex string
 * @return {Object}
 */
HitUtil.prototype.color = function(str) {
  var strToHex = this.colorPalette[str.split('').reduce(function(p, c) {
    return p + c.charCodeAt();
  }, 0) % this.colorPalette.length];

  return {'background-color': strToHex};
};

