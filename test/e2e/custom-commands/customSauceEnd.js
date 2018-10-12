exports.command = function (callback) {
  var SauceLabs = require('saucelabs')

  var saucelabs = new SauceLabs({
    username: process.env.SAUCE_USERNAME,
    password: process.env.SAUCE_ACCESS_KEY
  })

  var self = this
  saucelabs.updateJob(this.capabilities['webdriver.remote.sessionid'], {
    passed: this.currentTest.results.testcases[this.currentTest.name].failed === 0,
    name: this.currentTest.name
  }, function () {
    self.end(callback)
  })
}
