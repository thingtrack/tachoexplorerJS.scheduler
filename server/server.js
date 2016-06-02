var loopback = require('loopback');
var boot = require('loopback-boot');
var RED = require('node-red');

var app = module.exports = loopback();

app.start = function() {
    // start the web server
    return app.listen(function() {
        app.emit('started');
        var baseUrl = app.get('url').replace(/\/$/, '');
        console.log('Web server listening at: %s', baseUrl);
        if (app.get('loopback-component-explorer')) {
            var explorerPath = app.get('loopback-component-explorer').mountPath;
            console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
        }
    });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
// Red-node back-end
boot(app, __dirname, function(err) {
    if (err) throw err;

    // start the server if `$ node server.js`
    if (require.main === module) {
        var server = app.start();

        // Create the settings object - see default settings.js file for other options
        var settings = {
            // By default, the Node-RED UI is available at http://localhost:1880/
            // The following property can be used to specifiy a different root path.
            // If set to false, this is disabled.
            httpAdminRoot:"/red",
            // Some nodes, such as HTTP In, can be used to listen for incoming http requests.
            // By default, these are served relative to '/'. The following property
            // can be used to specifiy a different root path. If set to false, this is
            // disabled.
            httpNodeRoot: "/api",
            // To enable user authentication on the Editor and Admin API
            adminAuth: {
                type: "credentials",
                users: [{
                    username: "admin",
                    password: "$2a$08$ppza.lg5krSiiNdk5D4VO.qHkP80lMOeP8A.xR99nZzIF9n3xDC2e",
                    permissions: "*"
                }]
            },
            // By default, all user data is stored in the Node-RED install directory. To
            // use a different location, the following property can be used
            userDir:".nodered/",
            // Anything in this hash is globally available to all functions.
            // It is accessed as context.global.
            // eg:
            //    functionGlobalContext: { os:require('os') }
            // can be accessed in a function block as:
            //    context.global.os
            functionGlobalContext: {
                fs:require('fs'),                      // file system node core module
                moment:require('moment'),              // datetime node manager
                base64Stream:require('base64-stream'), // base64 stream manager node module
                imap:require('imap'),                  // imap email client
                request:require('request'),            // request node module
                stream:require('stream'),              // stream manager node core module
                loopback:app                           // loopback services
            }
        };

        // Initialise the runtime with a server and settings
        RED.init(server, settings);

        // Serve the editor UI from /red
        app.use(settings.httpAdminRoot, RED.httpAdmin);

        // Serve the http nodes UI from /api
        app.use(settings.httpNodeRoot, RED.httpNode);

        // Start the runtime
        RED.start();
    }
});
