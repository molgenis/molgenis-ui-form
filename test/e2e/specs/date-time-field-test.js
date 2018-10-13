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
    browser.getValue('#datetime-example-field ', function (result) {
      var format = moment.ISO_8601
      var utcResult = moment(result.value, format, true).utc()
      var utcExpected = moment('1985-08-12T11:12:13+05:00', format, true).utc()
      this.assert.equal(utcResult.year(), utcExpected.year())
      this.assert.equal(utcResult.month(), utcExpected.month()) // month is zero indexed
      this.assert.equal(utcResult.date(), utcExpected.date())
      this.assert.equal(utcResult.hour(), utcExpected.hour())
      this.assert.equal(utcResult.minute(), utcExpected.minute())
      this.assert.equal(utcResult.second(), utcExpected.second())
      this.assert.equal(utcResult.toDate().getTime(), utcExpected.toDate().getTime())
    })
    browser.expect.element('#datetime-example-field').to.have.attribute('class').which.contains('vf-valid')
    browser.end()
  }
}
