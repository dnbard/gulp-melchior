var PLUGIN_NAME = 'gulp-melchior',
    through = require('through2'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError,
    StringDecoder = require('string_decoder').StringDecoder,
    _ = require('lodash'),
    fs = require('fs');

function getConfigString(innerConfig, stringify){
    return stringify ? 'melchiorjs.config(' + JSON.stringify(innerConfig) + ');' :
        'melchiorjs.config(' + innerConfig + ')';
}

function prepareDependency(body, moduleName, config){
    if ((body+'').indexOf('melchiorjs.module') >= 0){
        //this is Melchior module, skip it
        return body;
    }

    var template = 'melchiorjs.module(\'${name}\')${require}.body(function(){${module}});',
        require = '';

    if (config.shim && config.shim[moduleName] && _.isArray(config.shim[moduleName].deps)){
        _.each(config.shim[moduleName].deps, function(dep){
            require += '.require(\'' + dep + '\')';
        });
    }

    removeDepsFromConfig(config, moduleName);

    return _.template(template, {
        name: moduleName,
        require: require,
        module: body
    });
}

function removeDepsFromConfig(config, moduleName){
    if (!config.shim || !config.shim[moduleName]){
        return;
    }

    delete config.shim[moduleName].deps;

    if (_.size(config.shim[moduleName]) === 0){
        delete config.shim[moduleName];
    }

    if (_.size(config.shim) === 0){
        delete config.shim;
    }
}

function preparePath(path, basePath){
    var result = basePath + path + '';

    if (result.indexOf('.js') === -1){
        result += '.js';
    }

    return result;
}

function autocompleteMissingMelchiorDeclaration(entryFile){
    if (/^\.module/.test(entryFile)){
        return 'melchiorjs' + entryFile;
    }

    return entryFile;
}

function gulpMelchior(options){
    options = options || {};

    var stream = through.obj(function(file, enc, cb) {
        function controlCallback(){
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
            originalFileWithoutConfig = autocompleteMissingMelchiorDeclaration(content.replace(originalConfig, '').trim()),
            customPaths = {},
            prePath = options.path || '',
            customConfig;

        file.contents = new Buffer(originalFileWithoutConfig);

        //TODO: remove eval =)
        eval('config = ' + preJSON);

        customConfig = config;

        _.each(config.paths, function(path, index){
            depsCount ++;

            if (path.indexOf('http://') !== -1 || path.indexOf('https://') !== -1 || path.indexOf('//') !== -1){

                customPaths[index] = path;
                console.log('%s External dependecy %s won\'t be concatenated', PLUGIN_NAME, index);

                controlCallback();
            } else {
                var body = prepareDependency(fs.readFileSync(preparePath(path, prePath)), index, config) + '\n';
                file.contents = Buffer.concat([new Buffer(body), file.contents]);

                controlCallback();
            }
        });

        if (_.size(customPaths) > 0){
            customConfig.paths = customPaths;
        } else {
            delete customConfig.paths;
        }

        if (!_.isEmpty(customConfig)){
            var configContent = getConfigString(customConfig, true);
            file.contents = Buffer.concat([new Buffer(configContent + '\n'), file.contents]);
        }

        this.push(file);
    });

    // returning the file stream
    return stream;
}

module.exports = gulpMelchior;
