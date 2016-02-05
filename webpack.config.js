module.exports = {
  context: __dirname + '/src/client',
  entry: {
    main: './main.es6',
    state: './state.es6',
    renderer: './renderer.es6'
  },
  output: {
    path: __dirname + '/client',
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /\.es6$/, loader: 'babel?presets[]=es2015' }
    ]
  },
  devtool: '#source-map'
}
