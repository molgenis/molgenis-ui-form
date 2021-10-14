/* eslint-disable no-unused-vars, no-unused-expressions */

module.exports = {
  tags: ['pseudonym'], // run this suite with 'yarn e2e --tag pseudonym'

  beforeEach: function (browser) {
    // http://localhost:8080/api/v2/PseudonymRegistrationConfig?q=ID=like=PseudonymRegistration

    // Wait for form to be loaded
    browser.url(browser.globals.devServerURL)
    browser.url(browser.globals.devServerURL + '/create-entity') // update-entity
    browser.expect.element('#pseudonym-create-btn').to.be.present
    browser.click('#pseudonym-create-btn')
    browser.expect.element('#OriginalID').to.be.present
    browser.click('#OriginalID')
    browser.clearValue('#OriginalID')
  },
  // DuplicatePseudonym
  'PseudonymRegistration Component should generate a new PseudonymRegistration ID':
    succesPseudonymRegistration,
  'PseudonymRegistration Component should throw a duplicate error on new PseudonymRegistration ID id collision':
    duplicateIDRegistration,
  'PseudonymRegistration Component should throw away input when cancel is pressed':
    cancelIDRegistriation
}

function succesPseudonymRegistration (browser) {
  browser.setValue('#OriginalID', 'test')
  browser.waitForElementVisible('#pseudonym-save-btn')
  browser.click('#pseudonym-save-btn')
  browser.waitForElementVisible('#clipboard-btn')
  browser.expect
    .element('#PseudonymRegistration')
    .to.have.value.that.equals('PseudonymID')
  browser.end()
}

function duplicateIDRegistration (browser) {
  const DUPLICATE_PSEUDONYM_ERROR = 'Error: This record already exist with the id: PseudonymID'
  browser.setValue('#OriginalID', 'DuplicatePseudonym')
  browser.waitForElementVisible('#pseudonym-save-btn')
  browser.click('#pseudonym-save-btn')
  browser.waitForElementVisible('#pseudonym-error')
  browser.expect.element('#pseudonym-error').text.to.equal(DUPLICATE_PSEUDONYM_ERROR)
  browser.end()
}

function cancelIDRegistriation (browser) {
  browser.setValue('#OriginalID', 'test')
  browser.waitForElementVisible('#pseudonym-cancel-btn')
  browser.click('#pseudonym-cancel-btn')
  browser.click('#pseudonym-create-btn')
  browser.expect
    .element('#OriginalID')
    .to.have.value.that.equals('')
  browser.end()
}
