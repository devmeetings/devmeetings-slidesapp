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
        "dm-admin": "../dm-admin",
        "jquery": "../components/jquery/dist/jquery",
        "jquery-ui": "../components/jquery-ui/jquery-ui",
        "angular": "../components/angular/angular",
        "angular-sanitize": "../components/angular-sanitize/angular-sanitize",
        "angular-ui-sortable": "../components/angular-ui-sortable/sortable",
        "restangular": "../components/restangular/dist/restangular",
        "bootstrap": "../components/bootstrap/dist/js/bootstrap",
        "angular-bootstrap": "../components/angular-bootstrap/ui-bootstrap-tpls",
        "ace": "../components/ace-builds/src-noconflict/ace",
        "ace_languageTools": "../components/ace-builds/src-noconflict/ext-language_tools",
        "lodash": "../components/lodash/dist/lodash",
        "asEvented": "../components/asEvented/asevented",
        "socket.io": "/socket.io/socket.io",
        "angular-animate": "../components/angular-animate/angular-animate",
        "howler": "../components/howler/howler",
        "angular-touch": "../components/angular-touch/angular-touch",
        "angular-slider": "../components/venturocket-angular-slider/build/angular-slider",
        "peerjs": "../components/peerjs/peer.min",
        "angular-deckgrid": "../components/angular-deckgrid/angular-deckgrid",
        "angular-gravatar-md5": "../components/angular-gravatar/build/md5",
        "angular-gravatar": "../components/angular-gravatar/build/angular-gravatar",
        "angular-ui-router": "../components/angular-ui-router/release/angular-ui-router",
        "lz-string": "../components/lz-string/libs/lz-string-1.3.3",
        "moment": "../components/moment/moment",
        "angular-moment": "../components/angular-moment/angular-moment",
        "angular-local-storage": "../components/angular-local-storage/angular-local-storage",
        "angular-hotkeys": "../components/angular-hotkeys/build/hotkeys",
        "coffee": "../components/coffee-script/extras/coffee-script",
        "angular-contenteditable": "../components/angular-contenteditable/angular-contenteditable",
        "angulartics": "../components/angulartics/dist/angulartics.min",
        "angulartics-ga": "../components/angulartics/dist/angulartics-ga.min",
        "angular-marked": "../components/angular-marked/angular-marked",
        "marked": "../components/marked/lib/marked",
        "angular-charts": "../components/angular-charts/dist/angular-charts.min",
        "angular-file-upload": "../components/ng-file-upload/angular-file-upload.min",
        "d3": "../components/d3/d3.min",
        "dm-training": "../dm-training/dm-training",
        "dm-user": "../dm-user/dm-user",
        "dm-observe": "../dm-observe/dm-observe",
        "dm-stream": "../dm-stream/dm-stream",
        "dm-mongotime": "../dm-mongotime/dm-mongotime",
        "dm-gravatar": "../dm-gravatar/dm-gravatar",
        "dm-wavesurfer": "../dm-wavesurfer/dm-wavesurfer",
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
        "angular": {
            "deps": ["jquery"],
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
        "restangular": {
            "deps": ["angular", "lodash"],
            "exports": "angular"
        },
        "ace": {
            "deps": [],
            "exports": "ace"
        },
        "ace_languageTools": {
            "deps": ["ace"]
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
        "lz-string": {
            "exports": "LZString"
        },
        "dm-training": {
            "deps": ["angular", "_"]
        },
        "dm-user": {
            "deps": ["angular"]
        },
        "dm-observe": {
            "deps": ["angular", "_"]
        },
        "dm-stream": {
            "deps": ["angular"]
        },
        "dm-mongotime": {
            "deps": ["angular"]
        },
        "dm-gravatar": {
            "deps": ["angular"]
        },
        "dm-wavesurfer": {
            "deps": ["angular"]
        },
        "angular-hotkeys": {
            "deps": ["angular"]
        }
    }
});