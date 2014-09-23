melchiorjs.config({
    paths: {
        // path key the same as global that lib exposes
        // saves from optional `shim` property on config
        'jQuery': 'http://cdn.jsdelivr.net/jquery/2.1.1/jquery.js',
        'underscore': 'http://cdn.jsdelivr.net/underscorejs/1.7.0/underscore.js',
        'gulpfile': 'gulpfile.js'
    },

    // provide shim to non-melchior modules
    shim: {
        // declare the global returned by library
        underscore: {
            exports: '_'
        }
    }
});

// create module
melchiorjs.module('app')

// define dependencies
.require('jQuery', '$')
.require('underscore', '_')

// define the module body
.body(function () {
    console.log('app');

    // return methods for other modules
    return {
        method: function () { },
        anotherMethod: function () { }
    };
});

melchiorjs.module('module').require('app').body(function(){
    console.log('module');
});
