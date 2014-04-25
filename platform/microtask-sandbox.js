var sys = require("sys");
var esprima = require('esprima');
var jqgram = require('jqgram').jqgram;

var code1 = "var i=0; if(i) { };";
var code2 = "var z=5;";

var tree1 = esprima.parse(code1);
var tree2 = esprima.parse(code2);

Object.prototype.ts = function() {
    return JSON.stringify(this, null, '  ');
}

sys.puts(tree1.ts());
sys.puts(tree2.ts());

function lfn(node) {
    return node.type;
}

function cfn(treename) {
    return function (node) {
        sys.puts(treename + " node: " + node.ts());
        //sys.puts("node: " + node.);
        if (node.type == 'VariableDeclaration')
            return node.declarations;
        else if (node.type == 'Program')
            return node.body;
        else if (node.type == 'IfStatement') {
        }
        else return null;
    }
}

jqgram.distance({ root: tree1, lfn: lfn, cfn: cfn("tree1") }, { root: tree2, lfn: lfn, cfn: cfn("tree2") }, { p: 2, q: 3, depth: 10 },
    function (result) {
        sys.puts(result.distance);
    });