#!/usr/bin/env node

var program = require('commander');

program
	.version('0.0.2')
	.usage('-pr -h myhost.com -u MyUserName -w MyPasswd -s "C:\localSourceFileOrFolder" -d "/home/RemoteFolder"')
	.option('-h, --host [host]', 'Host')
	.option('-o, --port [port]', 'Port', 21)
	.option('-u, --user [user]', 'User')
	.option('-w, --password [password]', 'Password')
	.option('-p, --put', 'Put')
	.option('-s, --source [file]', 'The source file/folder')
	.option('-d, --destination [folder]', 'The destination folder')
	.option('-r, --recursive', 'Recursive')
	.option('-c, --clean', 'Delete local file/folder after transfer')
	.parse(process.argv);

if(program.host && program.user && program.password && program.put && program.source && program.destination) {
	var FTPClient = require('ftp'),
		wrench = require('wrench'),
		fs = require('fs'),
		path = require('path'),
		async = require('async');

	var pJoin = function(a, b) {
		return path.join(a, b).replace(/\\/g, '/');
	}

	var ftp = new FTPClient();
	ftp.on('ready', function() {
		fs.stat(program.source, function(err, stats) {
			if(err) {
				throw err;
			} else if(!err && stats.isDirectory()) {
				if(program.recursive) {
					async.mapSeries(wrench.readdirSyncRecursive(program.source), function(file, callback) {
						fs.stat(pJoin(program.source, file), function(err, stats) {
							if(err) {
								throw err;
							} else if(!err && stats.isDirectory()) {
								ftp.mkdir(pJoin(program.destination, file), true, callback);
							} else {
								ftp.put(pJoin(program.source, file), pJoin(program.destination, file), callback);
							}
						});
					}, function(err, res) {
						if(err) {
							throw err;
						}
						console.log("Folder transferred successfully!");
						if(program.clean) {
							wrench.rmdirSyncRecursive(program.source);
							console.log('Local folder deleted successfully');
						}
						ftp.end();
					});
				} else {
					ftp.mkdir(pJoin(program.destination, path.basename(program.source)), true, function(err) {
						if(err) {
							throw err;
						}
						console.log("Folder transferred successfully!");
						if(program.clean) {
							wrench.rmdirSyncRecursive(program.source);
							console.log('Local folder deleted successfully');
						}
						ftp.end();
					});
				}
			} else {
				ftp[program.put ? 'put' : 'get'](program.source, pJoin(program.destination, path.basename(program.source)), function(err) {
					if(err) {
						throw err;
					}
					console.log("File transferred successfully!");
					if(program.clean) {
						fs.unlinkSync(program.source);
						console.log('Local file deleted successfully');
					}
					ftp.end();
				});
			}
		});
	});

	ftp.connect({
		host: program.host,
		port: program.port, // defaults to 21
		user: program.user,
		password: program.password
	});
}