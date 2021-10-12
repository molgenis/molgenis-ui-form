/* eslint-disable no-unused-vars, no-unused-expressions */
const nock = require('nock')
const { SingleEntryPlugin } = require('webpack')

module.exports = {
  tags: ['pseudonym'], // run this suite with 'yarn e2e --tag pseudonym'

  beforeEach: function (browser) {
    // http://localhost:8080/api/v2/PseudonymRegistrationConfig?q=ID=like=PseudonymRegistration

    // Wait for form to be loaded
    browser.url(browser.globals.devServerURL)
    browser.url(browser.globals.devServerURL + '/create-entity') // update-entity
  },

  'PseudonymRegistration Component should generate a new PseudonymRegistration ID': function (browser) {
    browser.options.desiredCapabilities.name = ''
    browser.pause()
    browser.expect.element('button#pseudonym-create-btn').to.be.present
    browser.click('button#pseudonym-create-btn')
    browser.expect.element('#create-pseudonym-registration-form').to.be.present
    browser.expect.element('#umcgnr').to.be.present
    browser.clearValue('#umcgnr')
    browser.setValue('#umcgnr', 'test')
    browser.click('#pseudonym-save-btn')

    browser.end()
  }
}
