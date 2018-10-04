/* eslint-disable no-unused-expressions */
const path = require('path')

module.exports = {
  tags: ['file'], // run this suite with 'yarn e2e --tag file'
  beforeEach: function (browser) {
    // Wait for form to be loaded
    browser.url(browser.globals.devServerURL)
    browser.url(browser.globals.devServerURL + '/file')
  },

  'File field should show the file name': function (browser) {
    browser.options.desiredCapabilities.name = 'File field should show the file name'
    browser.expect.element('#alt-file-example').to.be.present
    // bootstrap uses label to fake file input value
    browser.expect.element('#file-example-fs > div > div > div.custom-file > label').text.to.contain('test-file-name.txt')
    browser.end()
  },

  'File field allow selecting a file': function (browser) {
    browser.options.desiredCapabilities.name = 'File field allow selecting a file'
    browser.expect.element('#alt-file-example').to.be.present
    // bootstrap uses label to fake file input value
    browser.setValue('#alt-file-example', path.resolve(path.join(__dirname, 'file-field-test.js')))
    // test form state as file-example itself is hidden
    browser.expect.element('#file-example').to.have.attribute('class').which.contains('vf-form-dirty vf-form-valid vf-form-touched')
    browser.end()
  }

}
