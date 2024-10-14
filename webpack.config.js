const path = require('path');

module.exports = {
  entry: './src/index.js', // Entry point of your application
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  resolve: {
    fallback: {
      // "crypto": require.resolve("crypto-browserify"), // For polyfill
      // "path": require.resolve("path-browserify"),
      // "os": require.resolve("os-browserify/browser")
      assert: false,
      buffer: false,
      console: false,
      constants: false,
      crypto: require.resolve('crypto-browserify'),
      domain: false,
      events: false,
      http: false,
      https: false,
      os: require.resolve("os-browserify/browser"),
      path: require.resolve("path-browserify"),
      punycode: false,
   
      querystring: false,
      stream: false,
      string_decoder: false,
      sys: false,
      timers: false,
      tty: false,
      url: false,
      util: false,
      vm: false,
      zlib: false,
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
