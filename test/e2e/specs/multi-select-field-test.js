/* eslint-disable no-unused-expressions */

module.exports = {
  tags: ['multi-select'], // run this suite with 'yarn e2e --tag multi-select'
  beforeEach: function (browser) {
    // Wait for form to be loaded
    browser.url(browser.globals.devServerURL)
    browser.url(browser.globals.devServerURL + '/multi-select')
  },

  'Select multi select value': function (browser) {
    // browser.options.desiredCapabilities.name = 'Select multi select value'
    // browser.expect.element('#multi-select-form-example').to.be.present
    // browser.expect.element('#multi-select-form-example.vf-form-untouched.vf-form-pristine').to.be.present
    // browser.expect.element('.multiselect.vf-untouched.vf-pristine').to.be.present
    // browser.click('#multi-select-form-example')
    // browser.setValue('input[type=text]', ['5'])
    // browser.setValue('input[type=text]', [browser.Keys.ENTER])
    // browser.expect.element('#multi-select-form-example.vf-form-dirty.vf-form-valid.vf-form-touched').to.be.present
    // browser.expect.element('.multiselect__tag').text.to.contain('Option 5')

    // browser.end()
  },

  'Empty search param still yields options': function (browser) {
    browser.options.desiredCapabilities.name = 'Empty search param still yields options'
    browser.expect.element('#multi-select-form-example').to.be.present
    browser.click('#multi-select-form-example')
    browser.assert.elementCount('ul.multiselect__content > li.multiselect__element', 5)
    browser.end()
  },

  'Search term is cleared when item is selected': function (browser) {
    // browser.options.desiredCapabilities.name = 'Search term is cleared when item is selected'
    // browser.expect.element('#multi-select-form-example').to.be.present

    // // search for option five and select it
    // browser.click('#multi-select-form-example')
    // browser.setValue('input[type=text]', ['5'])
    // browser.assert.elementCount('ul.multiselect__content > li.multiselect__element', 1)
    // browser.setValue('input[type=text]', [browser.Keys.ENTER])

    // // verify that search window is closed
    // browser.expect.element('input[type=text]').to.not.be.visible

    // // reopen search window and verify that all four leftover options are shown
    // browser.click('#multi-select-form-example')
    // browser.assert.elementCount('ul.multiselect__content > li.multiselect__element', 4)
    // browser.expect.element('input[type=text]').text.to.equal('')

    // browser.end()
  }
}
