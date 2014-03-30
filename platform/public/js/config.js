require.config({
    "paths": {
        "decks": "../../decks",
        "plugins": "../plugins",
        "jquery": "../components/jquery/dist/jquery",
        "angular": "../components/angular/angular",
        "angular-sanitize": "../components/angular-sanitize/angular-sanitize",
        "angular-route": "../components/angular-route/angular-route",
        "restangular": "../components/restangular/dist/restangular",
        "bootstrap": "../components/bootstrap/dist/js/bootstrap",
        "angular-bootstrap": "../components/angular-bootstrap/ui-bootstrap-tpls",
        "ace": "../components/ace-builds/src-noconflict/ace",
        "lodash": "../components/lodash/dist/lodash",
        "asEvented": "../components/asEvented/asevented"
    },
    "map": {
        "*": {
            "$": "jquery",
            "_": "lodash"
        }
    },
    "shim": {
        "angular": {
            "deps": ["jquery"],
            "exports": "angular"
        },
        "bootstrap": {
            "deps": ["jquery"],
            "exports": "$"
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
        "restangular": {
            "deps": ["angular", "lodash"],
            "exports": "angular"
        },
        "ace": {
            "deps": [],
            "exports": "ace"
        }
    }
});