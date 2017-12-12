export default {
  entry: 'dist/index.js',
  dest: 'dist/bundles/ngx-zxing.umd.js',
  sourceMap: false,
  format: 'umd',
  moduleName: 'ngx-zxing',
  globals: {
    '@angular/core': 'ng.core',
  }
}
