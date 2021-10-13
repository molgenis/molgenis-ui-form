/* eslint-disable no-unused-vars, no-unused-expressions */
const { SingleEntryPlugin } = require('webpack')

module.exports = {
  tags: ['pseudonym'], // run this suite with 'yarn e2e --tag pseudonym'

  beforeEach: function (browser) {
    // http://localhost:8080/api/v2/PseudonymRegistrationConfig?q=ID=like=PseudonymRegistration

    // Wait for form to be loaded
    browser.url(browser.globals.devServerURL)
    browser.url(browser.globals.devServerURL + '/create-entity') // update-entity
  },
  // DuplicatePseudonym
  'PseudonymRegistration Component should generate a new PseudonymRegistration ID': function (browser) {
    browser.options.desiredCapabilities.name = ''
    browser.expect.element('button#pseudonym-create-btn').to.be.present
    browser.click('button#pseudonym-create-btn')
    browser.expect.element('#OriginalID').to.be.present
    browser.click('#OriginalID')
    browser.clearValue('#OriginalID')
    browser.setValue('#OriginalID', 'test')
    browser.waitForElementVisible('#pseudonym-save-btn')
    browser.click('#pseudonym-save-btn')
    browser.waitForElementVisible('#clipboard-btn')
    browser.expect.element('#PseudonymRegistration').to.have.value.that.equals('PseudonymID')
    browser.end()
  }
}
