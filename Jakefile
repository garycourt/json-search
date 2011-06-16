var async = require('./lib/async');
var fs = require('fs');
var spawn = require('child_process').spawn;
var peg = require('./lib/node-pegjs');

var srcDir = './src/';
var codeDirs = [srcDir, srcDir + 'util/', srcDir + 'analysis/', srcDir + 'analysis/porter/', srcDir + 'analysis/standard/', srcDir + 'index/', srcDir + 'search/', srcDir + 'parser/'];
var codeOutput = 'json-search.js';
var interfaceDirs = [srcDir + 'interface/'];
var interfaceOutput = 'interface.js';
var compressOutput = 'json-search.min.js';
var externs = 'externs.js';

/**
 * Default Task
 */

desc('This is the default task.');
task({'default' : ['compile', 'compress', 'wrap']}, function () {});

/**
 * Compile QueryParser Task
 */

desc('Compiles the QueryParser class.');
task('compileQueryParser', function () {
	fs.readFile(srcDir + 'parser/QueryParserImpl.pegjs', 'utf8', function (err, data) {
		if (err) {
			return fail(err);
		}
		
		var parser = peg.buildParser(data);
		fs.writeFile(srcDir + 'parser/QueryParserImpl.js', 'QueryParser.impl = ' + parser.toSource(), 'utf8', function (err) {
			if (err) {
				fail(err);
			} else {
				complete();
			}
		});
	});
}, true);

/**
 * Compile Task
 */

function compileFiles(files, output, callback) {
	async.map(files, fs.readFile, function (err, fileContents) {
		if (err) {
			console.error('Compiled failed during readFile');
			return callback(err);
		}
	
		var content = fileContents.join("\n\n");
		fs.writeFile(output, content, function (err) {
			if (err) {
				console.error('Compiled failed during writeFile');
			}
			return callback(err);
		});
	});
}

function compileDirs(dirs, output, callback) {
	async.map(dirs, fs.readdir, function (err, dirFiles) {
		if (err) {
			console.error('Compiled failed during readdir');
			return callback(err);
		}
		
		var files = [];
		for (var x = 0, xl = dirFiles.length; x < xl; ++x) {
			files = files.concat(dirFiles[x].filter(function (file) {
				return /\.js$/.test(file);
			}).sort(function (a, b) {
				if (a === 'common.js') { return -1; }
				if (b === 'common.js') { return 1; }
				if (a === 'Stream.js') { return -1; }
				if (b === 'Stream.js') { return 1; }
				if (a < b) { return -1; }
				if (a > b) { return 1; }
				return 0;
			}).map((function (dir, file) {
				return dir + file;
			}).bind(this, dirs[x])));
		}
		
		compileFiles(files, output, callback);
	});
}

desc('Concatenates all src files.');
task({'compile' : ['compileQueryParser']}, function () {
	async.parallel([
		compileDirs.bind(this, codeDirs, codeOutput),
		compileDirs.bind(this, interfaceDirs, interfaceOutput),
	], function (err) {
		if (!err) {
			console.log('Compile successful');
			complete();
		} else {
			fail(err);
			console.log('Compile failed');
		}
	});
}, true);

/**
 * Compress Task
 */

desc('Compresses compiled file.');
task('compress', function () {
	var args = [
		'-jar',
		'./lib/closure/compiler.jar',
		'--externs',
		externs,
		'--externs',
		interfaceOutput,
		'--js',
		codeOutput,
		'--js_output_file',
		compressOutput,
		'--compilation_level',
		'SIMPLE_OPTIMIZATIONS',
		'--language_in',
		'ECMASCRIPT3',
		//'--warning_level',
		//'VERBOSE',
		'--jscomp_warning',
		'accessControls',
		'--jscomp_warning',
		'ambiguousFunctionDecl',
		'--jscomp_warning',
		'checkRegExp',
		'--jscomp_warning',
		'checkTypes',
		'--jscomp_warning',
		'checkVars',
		'--jscomp_warning',
		'constantProperty',
		'--jscomp_warning',
		'deprecated',
		'--jscomp_warning',
		'externsValidation',
		'--jscomp_warning',
		'fileoverviewTags',
		'--jscomp_warning',
		'globalThis',
		'--jscomp_warning',
		'internetExplorerChecks',
		'--jscomp_warning',
		'invalidCasts',
		'--jscomp_warning',
		'missingProperties',
		'--jscomp_warning',
		'nonStandardJsDocs',
		'--jscomp_warning',
		'strictModuleDepCheck',
		'--jscomp_warning',
		'typeInvalidation',
		'--jscomp_warning',
		'undefinedVars',
		'--jscomp_warning',
		'unknownDefines',
		'--jscomp_warning',
		'uselessCode',
		'--jscomp_warning',
		'visibility'
	];
	
	var closure = spawn('java', args).on('exit', function (code) {
		if (code) {
			fail('Closure Compiler failed', code);
		} else {
			console.log('Compress successful');
			complete();
		}
	});
	
	closure.stdout.on('data', process.stdout.write.bind(process.stdout));
	closure.stderr.on('data', process.stderr.write.bind(process.stderr));
}, true);

/**
 * Wrap task
 */

desc('Wraps compiled files in a function.');
task('wrap', function () {
	async.parallel([
		function (callback) {
			//rewrite module
			fs.readFile(codeOutput, function (err, data) {
				if (!err) {
					fs.writeFile(codeOutput, 'var JSONSearch = (function () {\n\n' + data + '\n\nreturn exports;\n}());', callback);
				} else {
					callback(err);
				}
			});
		},
		function (callback) {
			//rewrite compressed module
			fs.readFile(compressOutput, function (err, data) {
				if (!err) {
					fs.writeFile(compressOutput, 'JSONSearch=function(){' + data + ';return exports}()', callback);
				} else {
					callback(err);
				}
			});
		}
	], function (err) {
		if (!err) {
			console.log('Wrapper successful');
			complete();
		} else {
			fail(err);
			console.log('Wrapper failed');
		}
	});
}, true);