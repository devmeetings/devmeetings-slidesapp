var sys = require("sys");
var esprima = require('esprima');
var clone = require('clone');
var jqgram = require('jqgram').jqgram;

Object.prototype.ts = function () {
    return JSON.stringify(this, null, '  ');
}

sys.put = function (msg) {
    sys.puts(msg.ts());
}

sys.ln = function () {
    sys.puts("\n=================================================\n");
}


/*run("var a=0;while(a<5) a++;",
    "var q=0;while(q<5) q=q+1;");*/

run("var a=0;while(a<5) a++;var a=0;while(a<5) a++;var a=0;while(a<5) a++;var a=0;while(a<5) a++;var a=0;while(a<5) a++;",
    "var q=0;while(q<5) q=q+1;var q=0;while(q<5) q=q+1;var q=0;while(q<5) q=q+1;var q=0;while(q<5) q=q+1;");

/* run("var a;var b",
    "var a,b;"); */

function run(code1, code2) {

    var tree1 = esprima.parse(code1);
    var tree2 = esprima.parse(code2);

    //var tree3 = visitTree(tree1, function (v) { return clone(v); });
    //sys.put(tree3);

    function lfn(node) {
        return node.type;
    }

    function cfn(treename) {

        return function (node) {
            var schema = {};
            node.visited = true;

            schema.VariableDeclaration = function (node) {
                return node.declarations;
            }

            schema.Program = function (node) {
                return node.body;
            }

            schema.VariableDeclarator = function (node) {
                if (node.init)
                    return [node.init];
            }

            schema.BlockStatement = schema.Program;

            schema.BinaryExpression = function (node) {
                return [node.left, node.right];
            }

            schema.LogicalExpression = schema.BinaryExpression;

            schema.IfStatement = function (node) {
                return [node.test, node.consequent];
            }

            schema.WhileStatement = function (node) {
                return [node.test, node.body];
            }

            schema.AssigmentExpression = function (node) {
                return
            }

            for (var rule in schema) {
                if (node.type == rule)
                    return schema[rule](node);
            }

            return null;
        }
    }

    function visitTree(node, visitor) {
        sys.put(node);
        var newnode = {};

        for (var propname in node) {
            sys.puts("visitNode:" + propname);

            var prop = node[propname];

            sys.puts("visitProp:" + propname + " type:" + (typeof prop));


            if (Object.prototype.toString.call(prop) === '[object Array]') {
                newnode[propname] = node[propname].map(function (e) {
                    return visitor(e);
                });
            } else if (typeof prop == 'Object') {
                newnode[propname] = visitTree(prop);
            }

        }

        return newnode;
    }

    jqgram.distance({ root: tree1, lfn: lfn, cfn: cfn("tree1") }, { root: tree2, lfn: lfn, cfn: cfn("tree2") }, { p: 2, q: 3, depth: 10 },
            function (result) {
                sys.ln();
                sys.puts(result.distance);
                sys.ln();
                sys.put(tree1);
                sys.put(tree2);
            });

    var start = +new Date();

    for (var i = 0; i < 1000; i++) {
        jqgram.distance({ root: tree1, lfn: lfn, cfn: cfn }, { root: tree2, lfn: lfn, cfn: cfn }, { p: 2, q: 3, depth: 20 },
           function () { });
    }

    var end = +new Date();  // log end timestamp
    var diff = end - start;

    sys.puts("Time diff:" + diff);
}

