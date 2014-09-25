melchiorjs.config({
    paths: {
        'jQuery': 'http://cdn.jsdelivr.net/jquery/2.1.1/jquery.js',
        //'underscore': 'http://cdn.jsdelivr.net/underscorejs/1.7.0/underscore.js',
        'module': '../module.js'
    }

    // provide shim to non-melchior modules
    /*shim: { underscore: { exports: '_' } }*/
});

// create module
melchiorjs.module('app').require('module').body(function () {
    console.log('app');

    return {
        method: function () { },
        anotherMethod: function () { }
    };
});
