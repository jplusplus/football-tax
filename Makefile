install:
	npm install && bower install

run:
	grunt serve

build:
	grunt --force

deploy: build
	grunt buildcontrol:heroku
