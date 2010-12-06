all: head min load


# for debugging
head: src/core.js src/css3.js src/load.js
	# grep "console" $^
	cat $^ > dist/head.js

min: head
	uglifyjs dist/head.js > dist/head.min.js
	
load: src/load.js
	uglifyjs $^ > dist/head.load.min.js
