module.exports = function (config) {
    config.set({
        browsers: ['PhantomJS'],
        plugins: [
            // Karma will require() these plugins
            require('karma-mocha'),
            require('karma-chai'),
            require('karma-webpack'),
            require('karma-sourcemap-loader'),
            require('karma-spec-reporter'),
            require('karma-phantomjs-launcher')
        ],
        frameworks: ['mocha', 'chai'],
        reporters: ['spec'],
        files: ['./index.js'],
        preprocessors: {'./index.js': ['webpack', 'sourcemap']},
        webpack: require('../../webpack/dev.js'),
        webpackMiddleware: {
            noInfo: true
        }
    })
}
