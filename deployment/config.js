var xplatformDir = __dirname + "/../";

module.exports = {

    appName: 'XPlatform.org',
    logsPath: xplatformDir + 'deployment/logs/',
    port: 9000,

    environments: {
        "xplatform-dev": {
            "name": "xplatform-dev",
            "path": xplatformDir + "../devmeetings-slidesapp-dev/platform",
            "options": {
                "buildGrunt": true,
                "startFile": "app.js",
                "logName": "xplatform.dev.log",
                "env": "NODE_ENV=\"test\"",
            },
            "btn": {
                "class": "btn-success",
                "label": "XPlatform [dev]"
            }
        },
        "xplatform-staging": {
            "name": "xplatform-staging",
            "path": xplatformDir + "../devmeetings-slidesapp-staging/platform",
            "options": {
                "buildGrunt": true,
                "startFile": "app.js",
                "logName": "xplatform.staging.log",
                "env": "NODE_ENV=\"staging\"",
            },
            "btn": {
                "confirm": true,
                "class": "btn-danger",
                "label": "XPlatform [staging]"
            }
        },
        "formage": {
            "name": "formage",
            "path": xplatformDir + "../devmeetings-slidesapp/tools/platform_admin",
            "options": {
                "buildGrunt": false,
                "cmd": "bash",
                "startFile": "run.sh",
                "logName": "formage.log",
                "env": "NODE_ENV=\"production\""
            },
            "btn": {
                "class": "btn-inverse",
                "label": "Formage [prod]"
            }
        },
        "xplatform-prod": {
            "name": "xplatform-prod",
            "path": xplatformDir + "platform",
            "options": {
                "buildGrunt": true,
                "startFile": "app.js",
                "logName": "xplatform.log",
                "env": "NODE_ENV=\"production\"",
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
                "logName": "exec-node.log",
                "env": ""
            },
            "btn": {
                "confirm": true,
                "class": "btn-warning",
                "label": "NodeExecutor [prod]"
            }
        },
        "expressExecutor": {
            "name": "expressExecutor",
            "path": xplatformDir + "executors/expressExecutor",
            "options": {
                "startFile": "app.js",
                "logName": "exec-express.log",
                "env": ""
            },
            "btn": {
                "confirm": true,
                "class": "btn-warning",
                "label": "ExpressExecutor [prod]"
            }
        },
        "javaExecutor": {
            "name": "javaExecutor",
            "path": xplatformDir + "executors/javaExecutor",
            "options": {
                "cmd": "bash",
                "startFile": "run",
                "logName": "exec-java.log",
                "noNpm": true,
                "env": ""
            },
            "btn": {
                "confirm": true,
                "class": "btn-warning",
                "label": "JavaExecutor [prod]"
            }
        },
        "deployment-app": {
            "name": "deployment-app",
            "path": xplatformDir + "../deployment-app",
            "options": {
                "startFile": "app.js",
                "logName": "deployment.log",
                "env": ""
            },
            "btn": {
                "class": "btn-info",
                "label": "Deployment App"
            }
        }
    },

    deploy: function(commands, env) {

        commands.addBash("git pull", "Updating working copy");

        if (!env.options.noNpm) {
            commands.addBash("npm install", "Installing npm modules");
        }

        if (env.options.buildGrunt) {
            commands.addBash("grunt build", "Build Frontend");
        }

        var startFile = env.options.startFile;
        var cmd = env.options.cmd ? "-c " + env.options.cmd : "";
        var extraEnv = env.options.env || "";

        commands.addBash("(forever stop " + env.name + " || true)", "Stopping service " + env.name);
        commands.addBash(extraEnv + " forever --uid " + env.name + " " + cmd + " -l " + env.options.logName + " -a start " + startFile, "Starting service " + env.name);
    }

};