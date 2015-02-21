require.config({
    "baseUrl": "/static/dm-slider",
    "paths": {
        "templates": "../templates",
        "slider/bootstrap": "slider/bootstrap-dev",
        "decks": "../../decks",

        //deprectated
        "slider": "../dm-slider/slider",
        "services": "../dm-slider/services",
        "utils": "../dm-slider/utils",
        "directives": "../dm-slider/directives",

        "require": "../../require",
        "plugins": "../dm-plugins",
        "xplatform": "../dm-xplatform",
        'dm-xplayer': '../dm-xplayer',
        "dm-admin": "../dm-admin",
        "dm-modules": "../dm-modules",
        "dm-courses": "../dm-courses",

        // libs
        "jquery": "../components/jquery/dist/jquery",
        "jquery-ui": "../components/jquery-ui/jquery-ui",
        "bootstrap": "../components/bootstrap/dist/js/bootstrap",
        "lodash": "../components/lodash/dist/lodash",
        "asEvented": "../components/asEvented/asevented",
        "socket.io": "/socket.io/socket.io",
        "howler": "../components/howler/howler",
        "peerjs": "../components/peerjs/peer.min",
        "lz-string": "../components/lz-string/libs/lz-string-1.3.3",
        "d3": "../components/d3/d3.min",
        "moment": "../components/moment/moment",
        "marked": "../components/marked/lib/marked",
        "coffee": "../components/coffee-script/extras/coffee-script",
        "ace": "../components/ace-builds/src-noconflict/ace",
        "ace_languageTools": "../components/ace-builds/src-noconflict/ext-language_tools",
        "js-beautify": "../components/js-beautify/js/index",
        "lib/beautify": "../components/js-beautify/js/lib/beautify",
        "lib/beautify-css": "../components/js-beautify/js/lib/beautify-css",
        "lib/beautify-js": "../components/js-beautify/js/lib/beautify-js",
        "lib/beautify-html": "../components/js-beautify/js/lib/beautify-html",
        "lib/file-saver":  "../components/FileSaver/FileSaver",
        "lib/favicojs": "../components/favico.js/favico",

        // Angular
        "angular": "../components/angular/angular",
        "restangular": "../components/restangular/dist/restangular",
        "angulartics": "../components/angulartics/dist/angulartics.min",
        "angulartics-ga": "../components/angulartics/dist/angulartics-ga.min",
        "angular-bootstrap": "../components/angular-bootstrap/ui-bootstrap-tpls",
        "angular-sanitize": "../components/angular-sanitize/angular-sanitize",
        "angular-ui-sortable": "../components/angular-ui-sortable/sortable",
        "angular-animate": "../components/angular-animate/angular-animate",
        "angular-touch": "../components/angular-touch/angular-touch",
        "angular-slider": "../components/venturocket-angular-slider/build/angular-slider",
        "angular-deckgrid": "../components/angular-deckgrid/angular-deckgrid",
        "angular-gravatar-md5": "../components/angular-gravatar/build/md5",
        "angular-gravatar": "../components/angular-gravatar/build/angular-gravatar",
        "angular-ui-router": "../components/angular-ui-router/release/angular-ui-router",
        "angular-moment": "../components/angular-moment/angular-moment",
        "angular-local-storage": "../components/angular-local-storage/angular-local-storage",
        "angular-hotkeys": "../components/angular-hotkeys/build/hotkeys",
        "angular-contenteditable": "../components/angular-contenteditable/angular-contenteditable",
        "angular-marked": "../components/angular-marked/angular-marked",
        "angular-charts": "../components/angular-charts/dist/angular-charts.min",
        "angular-file-upload": "../components/ng-file-upload/angular-file-upload.min",
        "angular-fullscreen": "../components/angular-fullscreen/src/angular-fullscreen",
        "angular-jsonedit": "../components/json-edit/js/directives"
    },
    "map": {
        "*": {
            "$": "jquery",
            "_": "lodash"
        }
    },
    "shim": {
        "templates": {
            "deps": ['slider/slider']
        },
        // Libs
        "jquery": {
            "exports": "$"
        },
        "jquery-ui": {
            "deps": ["jquery"]
        },
        "bootstrap": {
            "deps": ["jquery"],
            "exports": "$"
        },
        "ace": {
            "deps": [],
            "exports": "ace"
        },
        "ace_languageTools": {
            "deps": ["ace"]
        },
        "lz-string": {
            "exports": "LZString"
        },

        // Angular
        "angular": {
            "deps": ["jquery"],
            "exports": "angular"
        },
        "restangular": {
            "deps": ["angular", "lodash"],
            "exports": "angular"
        },
        "angular-sanitize": {
            "deps": ["angular"],
            "exports": "angular"
        },
        "angular-bootstrap": {
            "deps": ["angular"],
            "exports": "angular"
        },
        "angular-touch": {
            "deps": ["angular"],
            "exports": "angular"
        },
        "angular-slider": {
            "deps": ["angular-touch"]
        },
        "angular-ui-sortable": {
            "deps": ["angular", "jquery-ui"],
            "exports": "angular"
        },
        "angular-charts": {
            "deps": ["angular", "d3"],
            "exports": "angular"
        },
        "angular-animate": {
            "deps": ["angular"],
            "exports": "angular"
        },
        "angular-deckgrid": {
            "deps": ["angular"],
            "exports": "angular"
        },
        "angular-gravatar-md5": {
            "deps": ["angular"],
            "exports": "angular"
        },
        "angular-gravatar": {
            "deps": ["angular", "angular-gravatar-md5"],
            "exports": "angular"
        },
        "angular-ui-router": {
            "deps": ["angular"],
            "exports": "angular"
        },
        "angular-moment": {
            "deps": ["angular", "moment"]
        },
        "angular-marked": {
            "deps": ["angular", "../marked-wrapper"]
        },
        "angular-local-storage": {
            "deps": ["angular"]
        },
        "angular-contenteditable": {
            "deps": ["angular"]
        },
        "angulartics": {
            "deps": ["angular"]
        },
        "angulartics-ga": {
            "deps": ["angulartics"]
        },
        "angular-file-upload": {
            "deps": ["angular"]
        },
        "angular-hotkeys": {
            "deps": ["angular"]
        },
        "angular-fullscreen": {
          "deps": ["angular"]
        },
        "angular-jsonedit": {
          "deps": ["angular"]
        }
    }
});
