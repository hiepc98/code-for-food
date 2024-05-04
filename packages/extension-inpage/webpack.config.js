const path = require('path')

module.exports = [
  {
    entry: './src/index.ts',
    mode: 'production',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'index.js'
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
        },
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    target: 'web',
    node: {
      __dirname: false
    }
  }
]
