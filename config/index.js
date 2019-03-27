'use strict'
// Template version: 1.2.7
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const mockResponse = require('./mock-response.js')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
    before(app) {
      app.get('/api/v1/it_emx_datatypes_TypeTestRef', function (req, res) {
        res.json(mockResponse)
      })

      app.get('/api/v2/it_emx_datatypes_TypeTestRef', function (req, res) {
        res.json(mockResponse)
      })

      app.get('/api/v2/i18n/ui-form/en', function (req, res) {
        const localizedMessages = {
          'form_required_field': 'This field is required',
          'form_validation_failed': 'Validation failed',
          'form_not_unique': 'Not a unique value',
          'form_not_a_valid_number': 'Not a valid number',
          'form_not_a_valid_integer': 'Not a valid integer value',
          'form_not_a_valid_long': 'Not a valid long value',
          'form_not_a_valid_url': 'Not a valid URL',
          'form_not_a_valid_email': 'Not a valid email',
          'form_not_within_range': 'Value is outside of range',
          'form_below_min_value': 'Value is below allowed value',
          'form_above_max_value': 'Value is above allowed value',
          'form_boolean_true': 'True',
          'form_boolean_false': 'False',
          'form_boolean_missing': 'N/A',
          'form_no_options': 'No options found.',
          'form_hide_optional_hint': 'Hide optional fields.',
          'form_show_optional_hint': 'Show all fields.'
        }
        res.json(localizedMessages)
      })

      // mock unique test response
      app.get('/api/v2/it_emx_datatypes_TypeTest', function (req, res) {
        const result = req.query.q === 'string==\'string value\';id!=123-abc' ? {items: []} : {items: [{foo: 'bar'}]}
        res.json(result)
      })

    }
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
