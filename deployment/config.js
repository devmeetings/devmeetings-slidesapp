var xplatformDir = __dirname + "/../";

module.exports = {

    appName: 'XPlatform.org',
    logsPath: xplatformDir + 'deployment/logs/',
    port: process.env.PORT || 3000,

    environments: {
        "xplatform-prod": {
            "name": "xplatform-prod",
            "path": xplatformDir + "platform",
            "options": {
                "buildGrunt": true,
                "startFile": "app.js",
                "logName": "xplatform.log"
            },
            "btn": {
                "confirm": true,
                "class": "btn-danger",
                "label": "XPlatform [prod]"
            }
        },
        "nodeExecutor": {
            "name": "nodeExecutor",
            "path": xplatformDir + "executors/nodeExecutor",
            "options": {
                "startFile": "app.js",
                "logName": "exec-node.log"
            },
            "btn": {
                "confirm": true,
                "class": "btn-warning",
                "label": "NodeExecutor [prod]"
            }
        }
    },

    deploy: function(commands, env) {

        commands.addBash("git pull", "Updating working copy");

        commands.addBash("npm install", "Installing npm modules");

        if (env.options.buildGrunt) {
            commands.addBash("grunt build", "Build Frontend");
        }

        commands.addBash("(forever stop app.js || 1)", "Stopping service " + env.name);
        commands.addBash("forever start -l " + env.options.logName + "-a app.js", "Starting service " + env.name);
    }

};