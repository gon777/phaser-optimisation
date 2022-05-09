const { readFileSync, writeFileSync, unlinkSync } = require("fs");
const validate = require('sourcemap-validator');
const fs = require('fs');
const fse = require('fs-extra');
const assert = require('assert');
// const inject = require('gulp-inject-string');

const prebuildDir = 'pre_build';
const buildDir = 'build';
const buildAssetDir = 'build/assets';
const sourceMapDir = buildDir + '/maps';
const fileOptions = { encoding: 'utf8' };

module.exports = function(grunt) {

	grunt.initConfig({
		clean: {
			all: ['build/*'],
			sourcemaps: ['build/assets/**/*.map'],
			rsync_build: ['build', 'pre_build'],
			rsync_log: ['rsync_log.txt']
		},
		copy: {
			js: {  //copy javascript files
				files: [{
					expand: true,
					cwd: 'assets/',
					src: ['**/*.js', '!lib/**'],
					dest: 'build/assets/'
				}]
			},
			other: {  //copy json/html/css/font/lib files
				files: [{ //index
					src: 'index.html',
					dest: 'build/'
				}, {//manifest
					src: 'manifest.json',
					dest: 'build/'
				}, {//ico
					src: 'favicon.ico',
					dest: 'build/'
				}, { //css folder
					expand: true,
					cwd: 'css/',
					src: ['**'],
					dest: 'build/css'
				}, { //font folder
					expand: true,
					cwd: 'font/',
					src: ['**'],
					dest: 'build/font'
				}, { //lib folder
					expand: true,
					cwd: 'lib/',
					src: ['**'],
					dest: 'build/lib'
				}, { //json
					expand: true,
					cwd: 'assets/',
					src: ['**/*.json'],
					dest: 'build/assets/'
				}
				]
			},
			content: {  //copy asset files png/jpg/json/wav/... etc
				files: [{
					expand: true,
					cwd: 'assets/',
					src: ['**/*', '!**/*.js', '!**/*.scene', '!lib/**'],
					dest: 'build/assets/'
				}]
			},
			sourcemaps: {  //copy sourcemaps generated from build
				expand: true,
				cwd: 'build/assets/',
				src: ['**/*.map'],
				dest: 'build/maps/'
			}
		},
		rsync: {
			options: {
				args: ["--verbose --archive --human-readable --log-file=\"rsync_log.txt\" --log-file-format=\"===%o===%n===\" --delete --prune-empty-dirs"],
				// include: ["*/","*.js"],
				include: ["*.js", "/client/", "/client/**/", "/client/*.js", "/client/**/*.js"],
				exclude: ["*"]
			},
			sync: {
				options: {
					src: "./assets/",
					dest: `./${prebuildDir}/assets/`
				}
			}
		},
		babel: {
			options: {
				sourceMap: false
			},
			build: {
				expand: true,
				cwd: 'build/assets/',
				src: ['**/*.js', '!lib/**'],
				dest: 'build/assets/'
			}
		},
		javascript_obfuscator: {
			options: {
				domainLock: [
					'localhost',
					'54.219.31.167',
					'.heynorby.com'],
				transformObjectKeys: true,
				deadCodeInjection: true,
				deadCodeInjectionThreshold: 0.2,
				stringArrayEncoding: ['base64'],
				sourceMap: true,
				//sourceMapBaseUrl: 'http://localhost:8080/',
				sourceMapFilename: 'map',
				sourceMapMode: 'separate'
			},
			build: {  //obfuscate all .js files except for lib and AudioProcessor
				expand: true,
				cwd: 'build/assets/',
				src: ['**/*.js', '!lib/**', '!**/AudioProcessor.js'],
				dest: 'build/assets/'
			}
		},
		replace: {
			sourcemaps: {
				src: ['build/assets/**/*.js'],
				overwrite: true,
				replacements: [{
					from: '//# sourceMappingURL=build/assets/',
					to: '//# sourceMappingURL=/maps/'
				}]
			}
		},
		symlink: {
			options: {
				overwrite: true,
				force: false
			},
			explicit: {
				src: 'assets/content',
				dest: 'build/assets/content'
			}
		},
		'http-server': {  //can use https
			local: {
				root: '',
				port: 8080,
				host: 'localhost',
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
				}
			},
			proxy: {
				root: '',
				port: 8080,
				host: 'localhost',
				proxy: "https://world.heynorby.com/",
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
				}
			},
			proxy_staging: {
				root: '',
				port: 8080,
				host: 'localhost',
				proxy: "https://staging-world.heynorby.com/",
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
				}
			}
		},
		append_line_rsync: {
			src: []
		}
		// watch: {
		// 	test:{
		// 		cwd: 'test',
		// 		src: '**/*/js',
		// 	},
		// 	tasks: ['watch']
		// },
	});

	////////////////////////////////
	//load npm tasks
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-http-server');
	grunt.loadNpmTasks('grunt-javascript-obfuscator');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-contrib-symlink');
	grunt.loadNpmTasks("grunt-rsync");

	////////////////////////////////
	//tasks
	///////////////////////////////

	grunt.registerTask('default', ['run']);
	//start local server
	grunt.registerTask('run', ['http-server:local']);
	//start local server proxy live site
	grunt.registerTask('proxy', ['http-server:proxy']);
	//start local server proxy staging site
	grunt.registerTask('proxy_staging', ['http-server:proxy_staging']);
	//build the project, for subsequent builds, only modified files will be built
	grunt.registerTask('build_rsync', [
		'clean:rsync_log', //delete rsync log file (because rsync log file always append)
		'create_prebuild_folder',  //create a prebuild folder for holding all rsync files
		'rsync:sync', //rsync files from assets/ to prebuild/assets/
		'update_task', //read rsync file update log, update remaining tasks to only work on those updated files. updated files = (assets/ - prebuild/assets/)
		'babel:build', //babel js(modified files only) in prebuild, output to build
		'javascript_obfuscator:build', //obfuscate js(modified) in build, output to build
		'replace:sourcemaps', //change the path of sourcemaps(modified) in obfuscated code
		'append_line_rsync', //append new line to obfuscated code(modified)(ensure phaser can properly load this code)
		'copy:sourcemaps', //move sourcemap files to a dedicated folder
		'clean:sourcemaps', //delete sourcemap files outside of that folder
		'copy:other', //copy other files (css, index.html etc)
		'symlink', //symlink assets/content/ folder
		'clean:rsync_log' //delete rsync log file to keep folder clean
	]);
	//build the project, symlink content files
	grunt.registerTask('build', ['clean:all', 'copy_js_other', 'add_build_time', 'babel', 'javascript_obfuscator', 'fix_sourcemaps']);
	//build the project, copy content files over (expensive)
	grunt.registerTask('build_full', ['clean:all', 'copy_all', 'babel', 'javascript_obfuscator', 'fix_sourcemaps']);
	//build the project, babel only
	grunt.registerTask('build_babel', ['clean:all', 'copy_js_other', 'babel']);

	///////////////////
	// helper-tasks
	////////////////////////
	grunt.registerTask('copy_js_other', ['copy:js', 'copy:other', 'symlink']);
	grunt.registerTask('copy_all', ['copy:js', 'copy:other', 'copy:content']);
	grunt.registerTask('fix_sourcemaps', ['replace:sourcemaps', 'append_line', 'copy:sourcemaps', 'clean:sourcemaps']);

	/////////////////////
	// custom tasks
	/////////////////////
	//create a prebuild folder for holding rsync files
	grunt.registerTask('create_prebuild_folder', () => {
		if(!fse.existsSync(`${prebuildDir}`)) {
			fse.mkdirSync(`${prebuildDir}`);
		}
	});
	//adding build time to settings.js
	grunt.registerTask('add_build_time', () => {
		let buildTimestamp = new Date().toISOString();
		writeFileSync('build/clientversion.txt', buildTimestamp);
		let data = readFileSync('build/assets/client/interface/settings/Settings.js', 'utf8');
		let result = data.replace('Build timestamp', `Build timestamp: ${buildTimestamp}`);
		writeFileSync('build/assets/client/interface/settings/Settings.js', result);
	});
	//append a new line to all js files in build/
	grunt.registerTask('append_line', () => {
		let folder = buildAssetDir;

		//fix obfuscated code
		iterateFolder(folder, (fullpath, path) => {
			if(!isJavascriptFile(fullpath)) return;

			let content = grunt.file.read(fullpath, fileOptions);
			content += '\n';
			grunt.file.write(fullpath, content, fileOptions);

			//
			console.log(`${fullpath} appended new line`);
		});
	});
	//append a new line to rsynced js files in build/
	grunt.registerTask('append_line_rsync', () => {
		let fileList = grunt.config.get(`append_line_rsync.src`);
		if(!fileList) return;

		for(let i = 0; i < fileList.length; i++) {
			let content = grunt.file.read(fileList[i], fileOptions);
			content += '\n';
			grunt.file.write(fileList[i], content, fileOptions);

			//
			console.log(`${fileList[i]} appended new line`);
		}
	});
	///read rsync file update log, update remaining tasks to only work on those updated files. updated files = (assets/ - prebuild/assets/)
	grunt.registerTask('update_task', () => {
		let modifiedFiles = [];
		let deletedFiles = [];

		//read rsync log file, get file update list
		let rsyncLogContent = readFileSync('rsync_log.txt', 'utf8');
		rsyncLogContent.split(/\r?\n/).forEach((line) => {
			let segments = line.split('===');
			if(segments.length > 1) {
				let action = segments[1];
				let fileName = segments[2];

				switch(action) {
					case 'recv':
						modifiedFiles.push(`${fileName}`);
						break;
					case 'del.':
						deletedFiles.push(`build/assets/${fileName}`);
						break;
					default:
						console.error(`Unhandled rysnc action ${action}`);
						break;
				}
				console.log(`File modified: ${action} ${fileName}`);
			}
		});

		//update build time
		// console.log("\nUpdating build version...");
		// let buildTimestamp = new Date().toISOString();
		// if(!fse.existsSync('build')) {
		// 	fse.mkdirsSync('build');
		// }
		// writeFileSync('build/clientversion.txt', buildTimestamp, { flag: 'w+' });
		// let data = readFileSync(`${prebuildDir}/assets/client/interface/settings/Settings.js`, 'utf8');
		// let result = data.replace('Build timestamp', `Build timestamp: ${buildTimestamp}`);
		// writeFileSync(`${prebuildDir}/assets/client/interface/settings/Settings.js`, result);
		// deletedFiles.push(`build/assets/client/interface/settings/Settings.js`);

		//delete obfuscated file
		console.log("\nDeleting obfuscated file...");
		for(let i = 0; i < deletedFiles.length; i++) {
			try {
				unlinkSync(deletedFiles[i]);
				unlinkSync(`${deletedFiles[i]}.map`);
				console.log(`deleted ${deletedFiles[i]}`);
				console.log(`deleted ${deletedFiles[i]}.map`);
			} catch(e) {
			}
		}

		//update source files of remaining tasks
		if(modifiedFiles.length > 0) {
			let targetFiles = [];

			//update babel source
			console.log("\nUpdating files to be babeled...");
			grunt.config.set('babel.build.cwd', `${prebuildDir}/assets/`);
			grunt.config.set('babel.build.src', modifiedFiles);

			//update obfuscate source
			console.log("\nUpdating files to be obfuscated...");
			targetFiles = [];
			for(let i = 0; i < modifiedFiles.length; i++) {
				targetFiles.push(`${modifiedFiles[i]}`);
			}
			targetFiles.push(`!**/AudioProcessor.js`);
			grunt.config.set('javascript_obfuscator.build.src', targetFiles);

			//update replace source
			targetFiles = [];
			for(let i = 0; i < modifiedFiles.length; i++) {
				targetFiles.push(`build/assets/${modifiedFiles[i]}`);
			}
			grunt.config.set('replace.build.src', targetFiles);

			//update append line
			grunt.config.set('append_line_rsync.src', targetFiles);

			//update copy sourcemaps
			targetFiles = [];
			for(let i = 0; i < modifiedFiles.length; i++) {
				targetFiles.push(`${modifiedFiles[i]}.map`);
			}
			grunt.config.set('copy.maps.src', targetFiles);
		}
	});
};

function iterateFolder(directory, fileCallback) {
	let dir = fse.readdirSync(directory);

	//path could be file or directory
	dir.forEach((path) => {
		let fullPath = directory + '/' + path;
		if(fse.statSync(fullPath).isFile()) {
			fileCallback(fullPath, path);
		} else {
			iterateFolder(fullPath, fileCallback);
		}
	});
}

function isJavascriptFile(path) {
	return path.split('.').pop() === 'js';
}

function isSorcemapFile(path) {
	return path.split('.').pop() === 'map';
}