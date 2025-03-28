const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        utils: "./js/utils2.js",
        customElements: "./js/customElements.js",
        validasi: "./js/validasi.js"
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        clean: true, 
    },
    mode: 'development', // Mode development untuk dev-server
    devServer: {
        static: path.resolve(__dirname, 'dist'), // Direktori untuk server
        compress: true, // Kompresi gzip
        port: 9000, // Port untuk dev-server
        open: true, // Membuka browser secara otomatis
        hot: true, // Enable Hot Module Replacement
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            title: 'Notes App - Dicoding',
            filename: "index.html",
        })
    ]
};
