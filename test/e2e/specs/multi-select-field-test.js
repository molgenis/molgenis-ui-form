/* eslint-disable no-unused-expressions */

module.exports = {
  tags: ['multi-select'], // run this suite with 'yarn e2e --tag multi-select'
  beforeEach: function (browser) {
    // Wait for form to be loaded
    browser.url(browser.globals.devServerURL)
    browser.url(browser.globals.devServerURL + '/multi-select')
  },

  'Select multi select value': function (browser) {
    browser.options.desiredCapabilities.name = 'Select multi select value'
    browser.expect.element('#multi-select-form-example').to.be.present
    browser.expect.element('#multi-select-form-example.vf-form-untouched.vf-form-pristine').to.be.present
    browser.expect.element('.multiselect.vf-untouched.vf-pristine').to.be.present
    browser.click('#multi-select-form-example')
    browser.setValue('input[type=text]', ['o'])
    browser.setValue('input[type=text]', [browser.Keys.ENTER])
    browser.expect.element('#multi-select-form-example.vf-form-dirty.vf-form-valid.vf-form-touched').to.be.present
    browser.end()
  },

  'Empty search param still yields options': function (browser) {
    browser.options.desiredCapabilities.name = 'Empty search param still yields options'
    browser.expect.element('#multi-select-form-example').to.be.present
    browser.click('#multi-select-form-example')
    browser.assert.elementCount('ul.multiselect__content > li.multiselect__element', 5)
    browser.end()
  }
}
