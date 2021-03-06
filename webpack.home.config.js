module.exports = {
    entry: ['babel-polyfill', './src/home/main.js'],
    target: 'electron',
    output: {
        path: `./app/bin/home`,
        filename: `bundle.home.js`
    },

    module: {
        loaders: [{
            test: /\.js$/,
            exclude: [
                `node-modules`
            ],
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        },
        {
            test: /\.vue$/,
            loader: 'vue'
        }]
    },

    node: {
        fs: "empty",
        electron: 'empty',
        __dirname: false
    },

    watch: true
};
