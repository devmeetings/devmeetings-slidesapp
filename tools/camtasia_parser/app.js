var dom = require("./node_modules/jsdom/lib/jsdom/level1/core").dom.level1.core,
    xml = require("node-xml/lib/node-xml"),
    _ = require('lodash');

var video = {
    source: {},
    stitch: {},
    chapters: []
};


var attrsToMap = function () {
    
};




var doc = new dom.Document();
var currentElement = doc;
var totalElements = 0;
var parser = new xml.SaxParser(function(cb) {
    cb.onStartDocument(function() {

    });
    cb.onEndDocument(function() {
        console.log((doc.getElementsByTagName("*").length === totalElements) ? "success" : "fail");
    });
    cb.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {
        totalElements++;
        var element = doc.createElement(elem);
        currentElement.appendChild(element);
        currentElement = element;
        if (elem === 'StitchedMedia') {
            console.log(element); 
        }
        //console.log("=> Started: " + elem + " uri="+uri +" (Attributes: " + JSON.stringify(attrs) + " )");
    });
    cb.onEndElementNS(function(elem, prefix, uri) {
        currentElement = currentElement.parentNode;
        //console.log("<= End: " + elem + " uri="+uri + "\n");
    });
    //cb.onCharacters(function(chars) {

    //});
    //cb.onCdata(function(cdata) {
        //console.log('<CDATA>'+cdata+"</CDATA>");
    //});
    //cb.onComment(function(msg) {
        //console.log('<COMMENT>'+msg+"</COMMENT>");
    //});
    //cb.onWarning(function(msg) {
        //console.log('<WARNING>'+msg+"</WARNING>");
    //});
    //cb.onError(function(msg) {
        //console.log('<ERROR>'+JSON.stringify(msg)+"</ERROR>");
    //});
});

//example read from file
parser.parseFile("./test/test0.xml");
