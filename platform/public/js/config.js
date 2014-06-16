require.config({
    "baseUrl": "/static/js",
    "paths": {
        "slider/bootstrap": "slider/bootstrap-dev",
        "decks": "../../decks",
        "require": "../../require",
        "plugins": "../plugins",
        "jquery": "../components/jquery/jquery",
        "jquery-ui": "../components/jquery-ui/ui/jquery-ui",
        "angular": "../components/angular/angular",
        "angular-sanitize": "../components/angular-sanitize/angular-sanitize",
        "angular-route": "../components/angular-route/angular-route",
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
        "peerjs":"../components/peerjs/peer.min"
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
        "angular-route": {
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
        }
    }
});
