/* eslint-disable no-unused-expressions */
var moment = require('moment')

module.exports = {
  tags: ['date-time'], // run this suite with 'yarn e2e --tag date-time'
  beforeEach: function (browser) {
    // Wait for form to be loaded
    browser.url(browser.globals.devServerURL)
    browser.url(browser.globals.devServerURL + '/date-time')
  },

  'Datetime field should be valid with valid datetime string': function (browser) {
    browser.options.desiredCapabilities.name = 'Datetime field only valid for datetime string'
    browser.expect.element('#datetime-example-field').to.be.present
    if (browser.options.desiredCapabilities.browserName !== 'safari') {
      browser.getValue('#datetime-example-field ', function (result) {
        var format = 'Y-MM-DD\\Thh:mm:ssZ'
        var utcResult = moment(result.value, format, true).utc().toDate().getTime()
        var utcExpected = moment('1985-08-12T08:12:13+02:00', format, true).utc().toDate().getTime()
        this.assert.equal(utcResult, utcExpected)
      })
    } else {
      browser.getValue('#datetime-example-field ', function (result) {
        var format = 'Y-MM-DD\\Thh:mm:ssZ'
        var utcResult = moment(result.value, format, true).utc()
        var utcExpected = moment('1985-08-12T08:12:13+02:00', format, true).utc()
        this.assert.equal(utcResult.year(), utcExpected.year())
        this.assert.equal(utcResult.month(), utcExpected.month())
        this.assert.equal(utcResult.dayOfYear(), utcExpected.dayOfYear())
        this.assert.equal(utcResult.hour(), utcExpected.hour())
        this.assert.equal(utcResult.minute(), utcExpected.minute())
        this.assert.equal(utcResult.second(), utcExpected.second())
      })
    }
    browser.expect.element('#datetime-example-field').to.have.attribute('class').which.contains('vf-valid')
    browser.end()
  }
}