var Hapi = require('hapi');
var Good = require('good');
var reddit = require('redwrap');

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
	path: '/frontpage',
	handler: function(request, reply) {
		reddit.list('hot', function(err, data, res) {
			frontpageReply(data);
		});

		function frontpageReply(data) {
			reply(data);
		}
	}
});

server.route({
	method: 'GET',
	path: '/r/{subreddit}',
	handler: function (request, reply) {
		reddit.r(encodeURIComponent(request.params.subreddit).toString(), function(err, data, res) {
			subredditReply(data);
		});

		function subredditReply(data) {
			reply(data);
		}
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