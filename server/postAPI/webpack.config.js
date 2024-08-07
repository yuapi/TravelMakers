const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
	mode: slsw.lib.webpack.isLocal ? "development" : "production",
	entry: slsw.lib.entries,
	devtool: "soruce-map",
	resolve: {
		extensions: [ ".mjs", ".json", ".ts", ".js" ]
	},
	output: {
		libraryTarget: "commonjs2",
		path: path.join(__dirname, ".webpack"),
		filename: "[name].js"
	},
	target: "node"
}