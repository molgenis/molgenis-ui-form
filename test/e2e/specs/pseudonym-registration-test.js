/* eslint-disable no-unused-vars, no-unused-expressions */
const nock = require('nock')

module.exports = {
  tags: ['pseudonym'], // run this suite with 'yarn e2e --tag pseudonym'

  beforeEach: function (browser) {
    const scope = nock('https://api.github.com')
      .get(uri => uri.includes('PseudonymRegistrationConfig'))
      .reply(200, {
        'items': [
          {
            'ID': 'PseudonymRegistration',
            'GeneratedTokenDescription': 'MyPseudonymID is cool for lost of reasons',
            'GeneratedTokenName': 'MyPseudonymID',
            'LinkEntityName': 'PseudonymConnector',
            'FieldName': 'umcgnr'
          }
        ]
      })
    // Wait for form to be loaded
    browser.url(browser.globals.devServerURL)
    browser.url(browser.globals.devServerURL + '/create-entity') // update-entity
  },

  'Integer field should be valid with valid integer': function (browser) {
    browser.options.desiredCapabilities.name = 'Integer field only valid for integers'
    browser.end()
  }
}
