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

const Util = require('./util');
const path = require('path');

const _logcat = Util.spawn('./bin/adb logcat');
_logcat.on('error', function(e) {
  console.info('ADB error:', e);
});
_logcat.stdout.setEncoding('utf8');

/** @type {ChildProcess} **/
exports.logcat = _logcat;

/**
 * Forks a process to clear provided package's data, buffers its output and
 * returns the process wrapped in a promise. This promise resolves to the
 * process' stdout or rejects with a child_process error.
 * @param {string} packageName Name of package for which to clear data.
 * @return {Promise}
 */
exports.clearData = function(packageName) {
  return Util.execute('./bin/adb shell pm clear %s', packageName);
};

/**
 * Forks a process to broadcast an intent action to the default
 * CampaignTrackingReceiver. The action defaults to the Google Play
 * Store's INSTALL_REFERRER, but may be set to any installer action.
 * The referrer may likewise be provided, or will default to a test / test
 * source / medium. Returns the process wrapped in a promise. This promise
 * resolves to the process' stdout or rejects with a child_process error.
 * @param {string} packageName
 * @param {string=} referrer The "referrer" extra to be passed with the Intent.
 * @param {string=} installer The action to be broadcast with the Intent.
 * @return {Promise}
 */
exports.install = function(packageName, referrer, installer) {
  installer = installer || 'com.android.vending.INSTALL_REFERRER';
  referrer = referrer || 'utm_source=test&utm_medium=test';

  return Util.execute('./bin/adb shell am broadcast -a %s ' +
      '-n "%s/com.google.android.gms.analytics.CampaignTrackingReceiver" ' +
      '--es referrer "%s"', installer, packageName, referrer);
};

/**
 * Forks a process to open a deep link. Because of
 * https://code.google.com/p/android/issues/detail?id=76026, replaces
 * ampersands with %26.
 * @param {string} deeplink URL to open.
 * @param {string} packageName Optionally, packageName may be specified,
 * although it's not generally necessary
 * @return {Promise}
 */
exports.open = function(deeplink, packageName) {
  packageName = packageName || '';
  return Util.execute('./bin/adb shell am start -a android.intent.action.VIEW' +
    ' -d "%s" %s', deeplink.replace('&', '%26'), packageName);
};

/**
 * Forks a process to set the value of a System log tag.
 * @param {string} tag The tag to set.
 * @param {value} value The value to set.
 * @return {Promise}
 */
exports.setProp = function(tag, value) {
  return Util.execute('./bin/adb shell setprop %s %s', tag, value);
};

