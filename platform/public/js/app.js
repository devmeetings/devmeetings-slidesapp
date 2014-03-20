require.config({
    "paths": {
        "jquery": "../components/jquery/dist/jquery",
        "angular": "../components/angular/angular",
        "bootstrap": "../components/bootstrap/dist/js/bootstrap",
        "angular-bootstrap": "../components/angular-bootstrap/ui-bootstrap-tpls",
        "ace": "../components/ace-builds/src-noconflict/ace"
    },
    "map": {
        "*": {
            "$": "jquery"
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
        "angular-bootstrap": {
            "deps": ["angular"],
            "exports": "angular"
        },
        "ace": {
            "deps": [],
            "exports": "ace"
        }
    }
});
require(["main", "bootstrap", "angular-bootstrap", "ace"], function() {
    console.log("Started", arguments);
});