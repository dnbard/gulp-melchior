var PLUGIN_NAME = 'gulp-melchior',
    through = require('through2'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError,
    StringDecoder = require('string_decoder').StringDecoder,
    request = require('request'),
    _ = require('lodash'),
    fs = require('fs');

function getConfigString(innerConfig, stringify){
    return stringify ? 'melchiorjs.config(' + JSON.stringify(innerConfig) + ');' :
        'melchiorjs.config(' + innerConfig + ')'
}

function gulpMelchior(){
    var stream = through.obj(function(file, enc, cb) {
        function controlCallback(self){
            if (depsCount === config.paths.length){
                cb();
            }
        }

        var decoder = new StringDecoder('utf8'),
            content = (decoder.write(file.contents) + ''),
            originalConfig = getConfigString(content.match(/melchiorjs.config\(([\s\S]*?)\)/)[1]),
            withoutComments = content.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, '').replace('\r\n', ''),
            preJSON = withoutComments.match(/melchiorjs.config\(([\s\S]*?)\)/)[1],
            config,
            depsCount = 0,
            originalFileWithoutConfig = content.replace(originalConfig, '').trim(),
            customConfig,
            customPaths = {};

        file.contents = new Buffer(originalFileWithoutConfig);

        //TODO: remove eval =)
        eval('config = ' + preJSON);

        customConfig = config;

        _.each(config.paths, function(path, index){
            if (path.indexOf('http://') !== -1 || path.indexOf('https://') !== -1){

                customPaths[index] = path;

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

        customConfig.paths = _.size(customPaths) > 0 ? customPaths: undefined;
        file.contents = Buffer.concat([new Buffer(getConfigString(customConfig, true)), file.contents]);

        this.push(file);
    });

    // returning the file stream
    return stream;
}

module.exports = gulpMelchior;
