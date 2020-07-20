const path = require('path');

module.exports = {
  entry: './index.ts',
  externals: {
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react",
      var: "React"
    },
    "react-dom": {
      root: "ReactDOM",
      commonjs2: "react-dom",
      commonjs: "react-dom",
      amd: "react-dom",
      var: "ReactDOM"
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'createReactMFE',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
};