/* eslint-disable no-unused-expressions */

module.exports = {
  tags: ['compound'], // run this suite with 'yarn e2e --tag compound'
  beforeEach: function (browser) {
    // Wait for form to be loaded
    browser.url(browser.globals.devServerURL)
    browser.url(browser.globals.devServerURL + '/compound')
  },

  'Should show fields inside compound': function (browser) {
    browser.options.desiredCapabilities.name = 'Show fields inside compound'
    browser.expect.element('#compound-example-fs').to.be.present
    browser.expect.element('fieldset fieldset#compound-string-fs').to.be.present
    browser.expect.element('fieldset fieldset#compound-multi-select-fs').to.be.present
    browser.end()
  }
}
