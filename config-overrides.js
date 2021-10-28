const { override, overrideDevServer, addWebpackPlugin } = require('customize-cra');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const rewireCssModules = require('react-app-rewire-css-modules');

const multipleEntry = require('react-app-rewire-multiple-entry')([
	{
		entry: 'src/popup/index.js',
		template: 'public/popup.html',
		outPath: '/popup.html'
	},
	{
		entry: 'src/background/index.js',
		template: 'public/background.html',
		outPath: '/background.html'
	},
	{
		entry: 'src/content/index.js',
		template: 'public/index.html',
		outPath: '/index.html'
	}
]);

// var fileExtensions = ['jpg', 'jpeg', 'png', 'gif', 'eot', 'otf', 'svg', 'ttf', 'woff', 'woff2'];
// // load the secrets
// var alias = {};

const devServerConfig = () => config => {
	return {
		...config,
		writeToDisk: true
	};
};

// const copyPlugin = new CopyPlugin({
// 	patterns: [{ from: 'public/manifest.json', to: '' }]
// });
const copyPlugin = new CopyPlugin({
	patterns: [
		{ from: 'public/manifest.json', to: '' },
		{ from: 'public', to: '' },
		{ from: 'src/hot-reload.js', to: '' }
	]
});
module.exports = {
	module: {
		rules: [
			// the url-loader uses DataUrls.
			// the file-loader emits files.
			{
				test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				// Limiting the size of the woff fonts breaks font-awesome ONLY for the extract text plugin
				// loader: "url?limit=10000"
				use: 'url-loader'
			},
			{
				test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
				use: 'file-loader'
			},
			{
				test: /\.css$/,
				loader: ['to-string-loader', 'css-loader']
			}
		]
	},
	entry: ['font-awesome/scss/font-awesome.scss', 'entry-file.js'],
	webpack: function (config, env) {
		// ...add your webpack config,
		config = rewireCssModules(config, env);
		multipleEntry.addMultiEntry(config);
		config.output.filename = 'static/js/[name].js';
		delete config.output.chunkFilename;
		delete config.optimization.splitChunks;
		delete config.optimization.runtimeChunk;

		let index = config.plugins.findIndex(
			p => p && p.options && p.options.filename && p.options.filename.includes('.css')
		);
		if (index > -1) {
			config.plugins[index].options.filename = 'static/css/[name].css';
			delete config.plugins[index].options.chunkFilename;
		}

		config.entry = {
			...config.entry,
			// content: __dirname + '/src/content/index.js',
			content: path.join(__dirname, 'src', 'content', 'index.js'),
			background: path.join(__dirname, 'src', 'background', 'index.js')
			// shopee: path.join(__dirname, 'src', 'content', 'index.js'),
			// root: path.join(__dirname, 'src', 'content', 'platform', 'root.js'),
		};
		// (config.resolve = {
		// 	alias: alias,
		// 	extensions: fileExtensions.map(extension => '.' + extension).concat(['.jsx', '.js', '.scss'])
		// }),
		// override(
		//    addWebpackPlugin(
		//       copyPlugin
		//    ),
		//    multipleEntry.addMultiEntry,
		// )(config)
		addWebpackPlugin(copyPlugin)(config);
		return config;
	},
	devServer: overrideDevServer(devServerConfig())
};
