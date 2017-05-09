//Most of this should be something we recognize, but we had to add a babel preset, stage-2, and also
//transform-decorators-legacy. 

const path = require('path');
const srcPath = path.resolve(__dirname, 'src');
const distPath = path.resolve(__dirname, 'dist');

module.exports = {
    context: srcPath,
    target: 'web',

    entry: './app/app.js',
    output: {
        path: srcPath,
        filename: './public/js/bundle.js',
        publicPath: '/'
    },
    resolve: {
        modules: ['node_modules', 'src'],
        extensions: ['*', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                  presets:['es2015','react','stage-2'],
                  plugins:['transform-decorators-legacy']
                }
            }
        ]
    },
    devtool: 'source-map'
};
