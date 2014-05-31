[{
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
        "code": "function foo(items) {\n  var x = \"All this is syntax highlighted\" + items;\n  return x;\n}\nvar x = {\n  name: foo(\"something\")\n};\n",
        "serverRunner": "nodejs",
        "title": "Node runner / server runner",
        "notes": "",
        "id": "slide1-node",
        "name": "Node runner"
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
        "code": "function foo(items) {\n  var x = \"All this is syntax highlighted\" + items;\n  return x;\n}\nvar x = {\n  name: foo(\"something\")\n};\n",
        "monitor": "x",
        "jsrunner": true,
        "title": "Slides are awesome",
        "notes": "On this slide we show basic code execution with monitoring. If you change the code the output will change accordingly.\n",
        "id": "slide1",
        "name": "Slide 1"
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
        "code": "var array = [1, 2, 3, [4, 5]];\n",
        "jsrunner": true,
        "monitor": "array",
        "title": "Second slide is also awesome",
        "notes": "On this slide we show capabilities of our JSON inspector. Just dig inside array.\nSome another snippet var y = function() {\n  var x = \"123\" + 4;\n  return ~x;\n}; console.log(y());\n",
        "id": "slide2",
        "name": "Second slide"
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
        "pwyw": true
    }, {
        "code": "var end = \"Thanks for listening!\"",
        "monitor": "end",
        "jsrunner": true,
        "title": "This is the end...",
        "notes": "\"Say goodbye nicely\";\n",
        "id": "slide3",
        "name": "Ending"
    }
]
