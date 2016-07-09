var failPlugin = require('webpack-fail-plugin');

module.exports = {
	
    entry: "./src/boot/main.ts",
    output: {
        filename: "./dist/main.js",
        libraryTarget: "commonjs2"
    },
	
	plugins: [
		failPlugin
	],
    // devtool: "source-map",

    resolve: {
        extensions: ["", ".ts", ".js"]
    },

    module: {
        loaders: [
            { test: /\.ts$/, loader: "ts-loader" }
        ]
    }
};