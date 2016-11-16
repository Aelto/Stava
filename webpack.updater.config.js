module.exports = {
    entry: ['babel-polyfill', './src/updater/main.js'],
    target: 'electron',
    output: {
        path: `./app/bin/updater`,
        filename: `bundle.updater.js`
    },

    module: {
        loaders: [{
            test: /\.js$/,
            exclude: [
                `node-modules`
            ],
            loader: 'babel-loader'
        },
        {
            test: /\.vue$/,
            loader: 'vue'
        }]
    },

    node: {
        fs: "empty",
        electron: 'empty',
        path: 'empty',
        __dirname: false
    },

    watch: true
};
