const webpack = require('webpack');
const path = require('path');

const { NODE_ENV } = process.env;

module.exports = {
  mode: NODE_ENV === 'production' ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
    ],
  },
  entry: './src/index.js',
  optimization: {
    minimize: NODE_ENV === 'production',
  },
  output: {
    filename: `update-classes${NODE_ENV === 'production' ? '.min' : ''}.js`,
    path: path.resolve(__dirname, 'dist'),
    library: 'updateClasses',
    libraryTarget: 'umd',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),
  ],
};
