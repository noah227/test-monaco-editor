const {defineConfig} = require('@vue/cli-service')

const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin")
const webpack = require("webpack")

module.exports = defineConfig({
	transpileDependencies: true,
	configureWebpack: {
		devtool: false,
		output: {
			filename: "js/[name].js"
		},
		plugins: [
			new MonacoWebpackPlugin(),
			new webpack.DefinePlugin({
				__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
			})
		]
	},
})
