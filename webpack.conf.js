const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    // http://nodejs.cn/api/path.html#path_path_resolve_paths
    // https://www.cnblogs.com/zytt/p/9038598.html
    path: path.resolve(__dirname, 'dist')
  }
};
