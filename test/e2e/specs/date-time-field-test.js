/* eslint-disable no-unused-expressions */
var moment = require('moment')

module.exports = {
  tags: ['date-time'], // run this suite with 'yarn e2e --tag date-time'
  beforeEach: function (browser) {
    // Wait for form to be loaded
    browser.url(browser.globals.devServerURL)
    browser.url(browser.globals.devServerURL + '/date-time')
  },

  afterEach: function (client, done) {
    client.customSauceEnd()

    setTimeout(function () {
      done()
    }, 1000)
  },

  'Datetime field should be valid with valid datetime string': function (browser) {
    browser.options.desiredCapabilities.name = 'Datetime field only valid for datetime string'
    browser.expect.element('#datetime-example-field').to.be.present
    if (browser.options.desiredCapabilities.browserName !== 'safari') {
      browser.getValue('#datetime-example-field ', function (result) {
        var format = moment.ISO_8601
        var utcResult = moment(result.value, format, true).utc().toDate().getTime()
        var utcExpected = moment('1985-08-12T08:12:13+02:00', format, true).utc().toDate().getTime()
        this.assert.equal(utcResult, utcExpected)
      })
    }
    browser.expect.element('#datetime-example-field').to.have.attribute('class').which.contains('vf-valid')
    browser.end()
  }
}
