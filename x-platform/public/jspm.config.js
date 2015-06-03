System.config({
  "baseURL": "/static",
  "transpiler": "babel",
  "babelOptions": {
    "optional": [
      "runtime"
    ]
  },
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "FileSaver": "github:eligrey/FileSaver.js@master",
    "angular": "github:angular/bower-angular@1.4.0",
    "angular-animate": "github:angular/bower-angular-animate@1.4.0",
    "angular-bootstrap": "github:angular-ui/bootstrap-bower@0.13.0",
    "angular-contenteditable": "github:akatov/angular-contenteditable@0.3.7",
    "angular-fullscreen": "github:fabiobiondi/angular-fullscreen@1.0.1",
    "angular-hotkeys": "github:chieffancypants/angular-hotkeys@1.4.5",
    "angular-local-storage": "github:grevory/angular-local-storage@0.2.2",
    "angular-marked": "npm:angular-marked@0.0.14",
    "angular-moment": "github:urish/angular-moment@0.10.1",
    "angular-sanitize": "github:angular/bower-angular-sanitize@1.4.0",
    "angular-touch": "github:angular/bower-angular-touch@1.4.0",
    "angular-ui-router": "github:angular-ui/ui-router@0.2.15",
    "angular-ui-sortable": "github:angular-ui/ui-sortable@0.13.3",
    "angulartics": "github:luisfarzati/angulartics@0.18.0",
    "asEvented": "github:mkuklis/asEvented@0.4.5",
    "babel": "npm:babel-core@5.4.7",
    "babel-runtime": "npm:babel-runtime@5.4.7",
    "bootstrap": "github:twbs/bootstrap@3.3.4",
    "chardin.js": "github:heelhook/chardin.js@0.1.3",
    "coffee-script": "github:jashkenas/coffeescript@1.9.3",
    "core-js": "npm:core-js@0.9.13",
    "favico.js": "github:ejci/favico.js@0.3.7",
    "js-beautify": "github:beautify-web/js-beautify@1.5.6",
    "json-edit": "github:mb21/JSONedit@0.2.0",
    "jsondiffpatch": "github:benjamine/JsonDiffPatch@0.1.31",
    "ng-file-upload": "github:danialfarid/ng-file-upload-bower@4.2.4",
    "ng-scrollbar": "github:asafdav/ng-scrollbar@0.0.7",
    "socket.io-client": "github:Automattic/socket.io-client@1.3.5",
    "github:angular-ui/ui-router@0.2.15": {
      "angular": "github:angular/bower-angular@1.4.0"
    },
    "github:angular/bower-angular-animate@1.4.0": {
      "angular": "github:angular/bower-angular@1.4.0"
    },
    "github:angular/bower-angular-sanitize@1.4.0": {
      "angular": "github:angular/bower-angular@1.4.0"
    },
    "github:angular/bower-angular-touch@1.4.0": {
      "angular": "github:angular/bower-angular@1.4.0"
    },
    "github:chieffancypants/angular-hotkeys@1.4.5": {
      "angular": "github:angular/bower-angular@1.4.0"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "github:twbs/bootstrap@3.3.4": {
      "jquery": "github:components/jquery@2.1.4"
    },
    "npm:core-js@0.9.13": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    }
  }
});

