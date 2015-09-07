var Hapi = require('hapi');
var Good = require('good');

var server = new Hapi.Server();
server.connection({port: 3000});

server.route({
	method: 'GET',
	path: '/',
	handler: function (request, reply) {
		reply.view('index');
	}
});

server.route({
	method: 'GET',
	path: '/{name}',
	handler: function (request, reply) {
		reply('Hello' + encodeURIComponent(request.params.name) + '!');
	}
});

server.register({
    register: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            events: {
                response: '*',
                log: '*'
            }
        }]
    }
}, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});

server.register(require('vision'), function(err){

	// Hapi.assert(!err, err);

	server.views({
		engines: {
			html: require('handlebars')
		}, 
		relativeTo: __dirname,
		path: './views'
	});
});