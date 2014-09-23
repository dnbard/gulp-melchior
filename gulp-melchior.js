var PLUGIN_NAME = 'gulp-melchior',
    through = require('through2'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError,
    StringDecoder = require('string_decoder').StringDecoder,
    request = require('request'),
    _ = require('lodash'),
    fs = require('fs');

function gulpMelchior(){
    var stream = through.obj(function(file, enc, cb) {
        function controlCallback(self){
            if (depsCount === config.paths.length){
                cb();
            }
        }

        var decoder = new StringDecoder('utf8'),
            content = (decoder.write(file.contents) + '').replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, '').replace('\r\n', ''),
            preJSON = content.match(/melchiorjs.config\(([\s\S]*?)\)/)[1],
            config,
            depsCount = 0;

        //TODO: remove eval =)
        eval('config = ' + preJSON);

        _.each(config.paths, function(path){
            if (path.indexOf('http://') !== -1 || path.indexOf('https://') !== -1){
                request(path, function(err, resp, body){
                    console.log('Got response from ' + path);

                    //file.contents = Buffer.concat([new Buffer(body), file.contents]);
                    //depsCount ++;

                    controlCallback(this);
                });
            } else {
                depsCount ++;

                var body = fs.readFileSync(path) + '\n';
                file.contents = Buffer.concat([new Buffer(body), file.contents]);

                controlCallback(this);
            }
        });

        this.push(file);
    });

    // returning the file stream
    return stream;
}

module.exports = gulpMelchior;
