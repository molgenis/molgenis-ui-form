/* eslint-disable no-unused-expressions */

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
  }

}
