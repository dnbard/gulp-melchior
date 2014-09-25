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
