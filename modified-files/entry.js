melchiorjs.config({"paths":{"jQuery":"http://cdn.jsdelivr.net/jquery/2.1.1/jquery.js"}});
melchiorjs.module('module').body(function(){
    console.log('module');
});

;

// create module
melchiorjs.module('app').require('module').body(function () {
    console.log('app');

    return {
        method: function () { },
        anotherMethod: function () { }
    };
});
