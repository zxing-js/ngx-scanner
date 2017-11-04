var angularVersion;
if (window.AngularVersionForThisPlunker === 'latest') {
  angularVersion = ''; //picks up latest
} else {
  angularVersion = '@' + window.AngularVersionForThisPlunker;
}

System.config({
  //use typescript for compilation
  transpiler: 'typescript',
  //typescript compiler options
  typescriptOptions: {
    emitDecoratorMetadata: true
  },
  paths: {
    'npm:': 'https://unpkg.com/'
  },
  //map tells the System loader where to look for things
  map: {

    'app': './src',
    '@angular/core': 'npm:@angular/core' + angularVersion + '/bundles/core.umd.js',
    '@angular/common': 'npm:@angular/common' + angularVersion + '/bundles/common.umd.js',
    '@angular/common/http': 'npm:@angular/common' + angularVersion + '/bundles/common-http.umd.js',
    '@angular/compiler': 'npm:@angular/compiler' + angularVersion + '/bundles/compiler.umd.js',
    '@angular/platform-browser': 'npm:@angular/platform-browser' + angularVersion + '/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic' + angularVersion + '/bundles/platform-browser-dynamic.umd.js',
    '@angular/http': 'npm:@angular/http' + angularVersion + '/bundles/http.umd.js',
    '@angular/router': 'npm:@angular/router' + angularVersion + '/bundles/router.umd.js',
    '@angular/forms': 'npm:@angular/forms' + angularVersion + '/bundles/forms.umd.js',
    '@angular/animations': 'npm:@angular/animations' + angularVersion + '/bundles/animations.umd.js',
    '@angular/platform-browser/animations': 'npm:@angular/platform-browser' + angularVersion + '/bundles/platform-browser-animations.umd.js',
    '@angular/animations/browser': 'npm:@angular/animations' + angularVersion + '/bundles/animations-browser.umd.js',

    '@angular/core/testing': 'npm:@angular/core' + angularVersion + '/bundles/core-testing.umd.js',
    '@angular/common/testing': 'npm:@angular/common' + angularVersion + '/bundles/common-testing.umd.js',
    '@angular/common/http/testing': 'npm:@angular/common' + angularVersion + '/bundles/common-http-testing.umd.js',
    '@angular/compiler/testing': 'npm:@angular/compiler' + angularVersion + '/bundles/compiler-testing.umd.js',
    '@angular/platform-browser/testing': 'npm:@angular/platform-browser' + angularVersion + '/bundles/platform-browser-testing.umd.js',
    '@angular/platform-browser-dynamic/testing': 'npm:@angular/platform-browser-dynamic' + angularVersion + '/bundles/platform-browser-dynamic-testing.umd.js',
    '@angular/http/testing': 'npm:@angular/http' + angularVersion + '/bundles/http-testing.umd.js',
    '@angular/router/testing': 'npm:@angular/router' + angularVersion + '/bundles/router-testing.umd.js',
    'tslib': 'npm:tslib@1.6.1',
    'rxjs': 'npm:rxjs',
    'typescript': 'npm:typescript@2.2.1/lib/typescript.js',
    'ngx-zxing': 'npm:ngx-zxing@latest',
    'zxing-typescript': 'npm:zxing-typescript@latest'
  },
  //packages defines our app package
  packages: {
    app: {
      main: './main.ts',
      defaultExtension: 'ts'
    },
    rxjs: {
      defaultExtension: 'js'
    },
    'zxing-typescript': {
      defaultExtension: 'ts'
    },
    'ngx-zxing': {
      main: 'ngx-zxing.umd.js',
      defaultExtension: 'js'
    }
  }
});