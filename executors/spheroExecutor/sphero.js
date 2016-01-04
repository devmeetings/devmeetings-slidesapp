var robo = require('node-sphero');

var s = new robo.Sphero();
var spheroPort = process.env.SPHERO_PORT || '/dev/rfcomm0';

var connected = false;
var sphero = null;
s.on('connected', function(b) {
	sphero = b;
	console.log("[*] Sphero OK");

	setTimeout(function(){
		console.log("[*] Sphero connected.");
		connected = true;
		sphero.setRGBLED(0, 255, 0, false);
	}, 5000);
});


var vm = require('vm');

module.exports = {

	connect: function() {
		s.connect(spheroPort);
	},

	run: function(code, reply) {
		var msg = JSON.parse(code);
		console.log("Executing", msg);

		if (!connected) {
			reply({
				success: false,
				errors: ['notconnected']
			});
			return;
		}

		try {
			var requireWhitelist = ['q', 'cylon'];
			var output = [];
			vm.runInNewContext(msg.files['index.js'].content, {
		        console: {
		            log: function() {
		                var args = [].slice.call(arguments);
		                output.push(args);
		                console.log.apply(console, args);
		                reply({
		                	success: true,
		                	result: output
		                });
		            }
		        },
		        require: function(module) {
		            if (requireWhitelist.indexOf(module) === -1) {
		                throw Error("Unknown module " + module);
		            }
		            return require(module);
		        },
		        sphero: sphero,
		        setTimeout: setTimeout
		    });
		    reply({
		    	success:true, 
		    	result: output
		   	});
		} catch (e) {
			reply({
				success: false,
				errors: [e.toString()],
				stacktrace: e.stack.split("\n")
			});
		}
		
		//sphero.setRGB(spheron.toolbelt.COLORS.RED, false);
	}

};
