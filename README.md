ftp-push
========

A CLI program to push local files &amp; folders to a remote FTP

# Installation & usage :
1. Download and install [nodeJS](http://nodejs.org/download/).


2. Go to the ftp-push folder and launch npm to download and compile the modules for your environment :

	```npm install```


3. Use the program with a command line :


	```sh
	node app.js -pr -h host.com -u UserName -w Passwd -s "C:\FileOrFolder" -d "/home/RemoteFolder"
	```

	Options:
	```
	  -h, --help                  output usage information
	  -V, --version               output the version number
	  -h, --host [host]           Host
	  -o, --port [port]           Port
	  -u, --user [user]           User
	  -w, --password [password]   Password
	  -p, --put                   Put
	  -s, --source [file]         The source file/folder
	  -d, --destination [folder]  The destination folder
	  -r, --recursive             Recursive
	  -c, --clean                 Delete local file/folder after transfer
	  ```
