System.config({
  "baseURL": "/static",
  "transpiler": "babel",
  "babelOptions": {
    "optional": [
      "runtime"
    ]
  },
  "paths": {
    "require/*": "../../require/*.js",
    "slider/*": "dm-slider/slider/*.js",
    "services/*": "dm-slider/services/*.js",
    "utils/*": "dm-slider/utils/*.js",
    "directives/*": "dm-slider/directives/*.js",
    "ace": "ace-wrapper.js",
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  },
  "buildCSS": false
});

System.config({
  "map": {
    "$": "github:components/jquery@2.1.4",
    "FileSaver": "github:eligrey/FileSaver.js@master",
    "_": "npm:lodash@3.9.3",
    "ace-builds": "github:ajaxorg/ace-builds@1.1.9",
    "ace_languageTools": "github:ajaxorg/ace-builds@1.1.9/ext-language_tools",
    "angular": "github:angular/bower-angular@1.4.5",
    "angular-animate": "github:angular/bower-angular-animate@1.4.0",
    "angular-bootstrap": "github:angular-ui/bootstrap-bower@0.13.0",
    "angular-contenteditable": "github:akatov/angular-contenteditable@0.3.7",
    "angular-fullscreen": "github:fabiobiondi/angular-fullscreen@1.0.1",
    "angular-local-storage": "github:grevory/angular-local-storage@0.2.2",
    "angular-marked": "github:Hypercubed/angular-marked@0.0.16",
    "angular-moment": "github:urish/angular-moment@0.10.1",
    "angular-qrcode": "github:monospaced/angular-qrcode@5.1.0",
    "angular-sanitize": "github:angular/bower-angular-sanitize@1.4.0",
    "angular-scrollbar": "github:asafdav/ng-scrollbar@0.0.7",
    "angular-touch": "github:angular/bower-angular-touch@1.4.0",
    "angular-tree-control": "github:wix/angular-tree-control@0.2.11",
    "angular-ui-router": "github:angular-ui/ui-router@0.2.15",
    "angulartics": "github:luisfarzati/angulartics@0.18.0",
    "asEvented": "github:mkuklis/asEvented@0.4.5",
    "babel": "npm:babel-core@5.4.7",
    "babel-runtime": "npm:babel-runtime@5.4.7",
    "bootstrap": "github:twbs/bootstrap@3.3.5",
    "coffee-script": "github:jashkenas/coffeescript@1.9.3",
    "core-js": "npm:core-js@0.9.13",
    "favico.js": "github:ejci/favico.js@0.3.7",
    "font-awesome": "npm:font-awesome@4.3.0",
    "howler": "github:goldfire/howler.js@1.1.26",
    "jquery": "github:components/jquery@2.1.4",
    "js-beautify": "github:beautify-web/js-beautify@1.5.6",
    "jsondiffpatch": "github:benjamine/JsonDiffPatch@0.1.31",
    "lodash": "npm:lodash@3.9.3",
    "marked": "npm:marked@0.3.3",
    "moment": "github:moment/moment@2.10.6",
    "monospaced/angular-qrcode": "github:monospaced/angular-qrcode@5.1.0",
    "ng-file-upload": "github:danialfarid/ng-file-upload@5.0.9",
    "ng-scrollbar": "github:asafdav/ng-scrollbar@0.0.7",
    "ng-sortable": "github:a5hik/ng-sortable@1.3.0",
    "qrcode-generator": "github:monospaced/bower-qrcode-generator@0.0.2",
    "socket.io": "github:Automattic/socket.io-client@1.3.5",
    "socket.io-client": "github:Automattic/socket.io-client@1.3.5",
    "text": "github:systemjs/plugin-text@0.0.2",
    "github:a5hik/ng-sortable@1.3.0": {
      "angular": "github:angular/bower-angular@1.4.5",
      "css": "github:systemjs/plugin-css@0.1.16"
    },
    "github:angular-ui/ui-router@0.2.15": {
      "angular": "github:angular/bower-angular@1.4.5"
    },
    "github:angular/bower-angular-animate@1.4.0": {
      "angular": "github:angular/bower-angular@1.4.5"
    },
    "github:angular/bower-angular-sanitize@1.4.0": {
      "angular": "github:angular/bower-angular@1.4.5"
    },
    "github:angular/bower-angular-touch@1.4.0": {
      "angular": "github:angular/bower-angular@1.4.5"
    },
    "github:fabiobiondi/angular-fullscreen@1.0.1": {
      "angular": "github:angular/bower-angular@1.4.5"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "github:twbs/bootstrap@3.3.5": {
      "jquery": "github:components/jquery@2.1.4"
    },
    "npm:core-js@0.9.13": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:font-awesome@4.3.0": {
      "css": "github:systemjs/plugin-css@0.1.16"
    },
    "npm:lodash@3.9.3": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

