/* eslint-disable no-unused-expressions */
var moment = require('moment')
var flatpickr = require('flatpickr')

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

      // const expectedTimeString = '1985-08-12T11:12:13+05:00'
      const timeString = result.value

      // Parse date by hand because safari handles date different then other browsers
      this.assert.equal(timeString.substring(0, 4), '1985', '1985 as year')
      this.assert.equal(timeString.substring(5, 7), '08', '01 as month')
      this.assert.equal(timeString.substring(8, 10), '12', '12 as day')
      this.assert.equal(timeString.substring(10, 11), 'T', 'T as time symbol')
      this.assert.equal(timeString, '1985-08-12T11:12:13+05:00', 'timestring')
      const hoursString = timeString.substring(11, 13)
      const offsetString = timeString.substring(20, 22)
      const hours = parseInt(hoursString)
      const offSet = parseInt(offsetString)
      const signString = timeString.substring(19, 20)
      const utcHours = signString === '+' ? hours - offSet : hours + offSet
      this.assert.equal(utcHours, 6, '6 as utc hours') // 11 - (+5) = 6
      this.assert.equal(timeString.substring(14, 16), '12', '12 as minute')
      this.assert.equal(timeString.substring(17, 19), '13', '13 as seconds')

    })
    browser.expect.element('#datetime-example-field').to.have.attribute('class').which.contains('vf-valid')
    browser.end()
  }
}
