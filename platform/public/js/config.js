require.config({
    "baseUrl": "/static/js",
    "paths": {
        "slider/bootstrap": "slider/bootstrap-dev",
        "decks": "../../decks",
        "require": "../../require",
        "plugins": "../plugins",
        "xplatform": "../xplatform",
        "jquery": "../components/jquery/dist/jquery",
        "jquery-ui": "../components/jquery-ui/jquery-ui",
        "angular": "../components/angular/angular",
        "angular-sanitize": "../components/angular-sanitize/angular-sanitize",
        "angular-ui-sortable": "../components/angular-ui-sortable/sortable",
        "restangular": "../components/restangular/dist/restangular",
        "bootstrap": "../components/bootstrap/dist/js/bootstrap",
        "angular-bootstrap": "../components/angular-bootstrap/ui-bootstrap-tpls",
        "ace": "../components/ace-builds/src-noconflict/ace",
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
        "video-js": "../components/video.js/dist/video-js/video",
        "video-js-youtube": "../components/videojs-youtube/src/youtube",
        "angular-hotkeys": "../components/angular-hotkeys/build/hotkeys",
        "coffee": "../components/coffee-script/extras/coffee-script",
        "angular-contenteditable": "../components/angular-contenteditable/angular-contenteditable"
    },
    "map": {
        "*": {
            "$": "jquery",
            "_": "lodash"
        }
    },
    "shim": {
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
        "restangular": {
            "deps": ["angular", "lodash"],
            "exports": "angular"
        },
        "ace": {
            "deps": [],
            "exports": "ace"
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
        "angular-local-storage": {
            "deps": ["angular"]
        },
        "angular-contenteditable": {
            "deps": ["angular"]
        },
        "lz-string": {
            "exports": "LZString"
        },
        "video-js-youtube": {
            "deps": ["video-js"]
        },
        "angular-hotkeys": {
            "deps": ["angular"]
        }
    }
});
