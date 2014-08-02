define([], [{
    "text": "<h2><span class=\"glyphicon glyphicon-heart\"></span> Nothing interesting here.</h2> <h3>But something should be!</h3> <p>Hello small text!</p>\n",
    "notes": "// These are some notes for fist slide. Just goan with standard 'Hello' for guys.\n",
    "id": "entry",
    "name": "Hello World",
    "title": "First slide!",
}, {
    "id": "chat",
    "name": "Chat",
    "title": "Chat",
    "chat": true
}, {
    "id": "entry2",
    "name": "Hello Left & Right",
    "title": "First slide - continuation",
    "left": {
        "text": "Hello there Left\n",
    },
    "right": {
        "text": "Hello there Right\n",
    }
}, {
    "code": "function foo(items) {\n  var x = \"All this is syntax highlighted\" + items;\n  return x;\n}\nvar x = {\n  name: foo(\"something\")\n};\nconsole.log(x);",
    "serverRunner": "nodejs",
    "title": "Node runner / server runner",
    "notes": "",
    "monitor": true,
    "id": "slide1-node",
    "name": "Node runner",
    "commit": true,
    "stream": true
}, {
    "code": "import java.util.Random;\nimport java.util.Arrays;\nimport java.util.List;\n\npublic class TestClass {\n\n  public static int rand() {\n    return new Random().nextInt();\n  }\n  \n  public static String main() {\n    final StringBuilder builder = new StringBuilder();\n    \n    // Java 8!\n    List features = Arrays.asList(\"Lambds\", \"Def6ault Method\", \"Stream API\", \"Date and Time API\");\n    features.forEach(n -> builder.append(n +  \" \"));\n    \n    builder.append(rand());\n    return builder.toString();\n  }\n  \n}",
    "serverRunner": "java",
    "title": "Java runner / server runner",
    "notes": "",
    "monitor": true,
    "id": "exec-java",
    "name": "Java runner",
    "commit": true,
    "stream": true
}, {
    "microtasks": [{
        "description": "Change <code>foo</code> to append \"x\" instead of prepending anything.",
        'hint': 'OMG OMG <strong>So hard!</strong>',
        'monitor': 'foo',
        "js_assert": "console.log(foo('a')); return foo(\"a\") === \"ax\";"
    }, {
        "output": {
            "name": "somethingx"
        },
        "description": "Output should be named <code>somethingx</code>"
    }],
    "toolbar": {
        "commit": true
    },
    "stream": true,
    "code": "function foo(items) {\n  var x = \"All this is syntax highlighted\" + items;\n  return x;\n}\nvar x = {\n  name: foo(\"something\")\n};console.log(x);\n",
    "monitor": "console_log",
    "jsrunner": true,
    "title": "Slides are awesome",
    "notes": "On this slide we show basic code execution with monitoring. If you change the code the output will change accordingly.\n",
    "id": "slide1",
    "name": "Slide 1"
}, {
    "microtasks": [{
        "jsonOutput": "x.name === 'somethingx'",
        "hint": "name === somethingx",
        "description": "Output should be named <code>somethingx</code>"
    }],
    "toolbar": {
        "commit": true
    },
    "stream": true,
    "code": "function foo(items) {\n  var x = \"All this is syntax highlighted\" + items;\n  return x;\n}\nvar x = {\n  name: foo(\"something\")\n};\n",
    "monitor": "x",
    "jsrunner": true,
    "title": "Output assertions",
    "name": "Output assert"
}, {
    "microtasks": [{
        "description": "Change <code>div</code> display to <code>inline</code>",
        "css": "div\\s*{\\s*display:\\s*inline;",
        "hint": "Try to fiddle with editor on the left"
    }, {
        "description": "Change <code>div</code> display to <code>inline-block</code>",
        "css": "div\\s*{\\s*display:\\s*inline-block;",
        "hint": "Go to css tab and change <code>display</code> property."
    }],
    "fiddle": {
        "active": "css",
        "html": "<html>\n  <head></head>\n  <body>\n  <h1>Sooo awesome</h1>\n  </body>\n</html>\n",
        "css": "div {\n  display: block;\n}\n",
        "js": "var x = 5;\n"
    },
    "id": "slide-html",
    "name": "HTML",
    "title": "Slide with HTML and CSS"
}, {
    "name": "AngularJS Fiddle",
    "microtasks": [{
        "fiddle": "exists('h2')",
        "description": "Create <code>h2</code> element"
    }, {
        "fiddle": "exists('ul > li', 3)",
        "description": "Create exactly 3 <code>lis</code> inside <code>ul</code>"
    }],
    "fiddle": {
        "size": "xl",
        "active": "html",
        "js": "var app = angular.module('app', []);\n\napp.controller('MainCtrl', ['$scope', function($scope) {\n    \n    $scope.name = 'AngularJS';\n    \n}]);",
        "html": "<!DOCTYPE html>\n<html ng-app=\"app\">\n  <head>\n    <meta charset=\"utf-8\">\n    <title>AngularJS</title>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link href=\"//netdna.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css\" rel=\"stylesheet\">\n  </head>\n  <body>\n  \n    <div class=\"container main-container\" role=\"main\" ng-controller=\"MainCtrl\">\n      <h1>Hello {{ name }}!</h1>\n    </div>\n    \n    <script src=\"//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.js\"></script>\n    <script src=\"//netdna.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.js\"></script>\n    <script src=\"//ajax.googleapis.com/ajax/libs/angularjs/1.2.20/angular.js\"></script>\n    <script src=\"//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.10.0/ui-bootstrap-tpls.js\"></script>\n    \n    <script src=\"//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular-route.js\"></script>\n    <script src=\"//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.10/angular-ui-router.js\"></script>\n    \n    <script src=\"//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular-animate.js\"></script>\n    <script src=\"//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular-cookies.js\"></script>\n  </body>\n</html>",
        "css": ""
    }
}, {
    "code": "var array = [1, 2, 3, [4, 5]];\n",
    "jsrunner": true,
    "monitor": "array",
    "title": "Second slide is also awesome",
    "notes": "On this slide we show capabilities of our JSON inspector. Just dig inside array.\nSome another snippet var y = function() {\n  var x = \"123\" + 4;\n  return ~x;\n}; console.log(y());\n",
    "id": "slide2",
    "name": "Second slide"
}, {
    "code": "array = [1..3]\narray.push 5\n",
    "jsrunner": "coffee",
    "monitor": "array",
    "title": "Coffee Script",
    "notes": "",
    "id": "coffeePlayground",
    "name": "Coffee script"
}, {
    "speedDating": {
        "time": 15,
        "perPerson": 40
    },
    "id": "speedDating",
    "name": "Speed Dating",
    "title": "Speed Dating"
}, {
    "text": "something",
    "task": {
        "duration": 5,
        "objectives": ["Display an array of todos using DOM"],
        "extras": [
            "Use Bootstrap <code>.list-group</code> component.",
            "Don't use <code>.innerHTML</code>, <code>.textContent</code>, etc."
        ]
    },
    "id": "task",
    "name": "Task",
    "title": "This is task!"
}, {
    "id": "pwyw",
    "name": "Pay What You Want",
    "pwyw": "My First Training"
}, {
    "code": "var end = \"Thanks for listening!\"",
    "monitor": "end",
    "jsrunner": true,
    "title": "This is the end...",
    "notes": "\"Say goodbye nicely\";\n",
    "id": "slide3",
    "name": "Ending"
}]);