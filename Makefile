install:
	npm install && bower install

run:
	grunt serve

build:
	grunt --force

deploy: build
	grunt buildcontrol:heroku

# This will copy every keys from en.js to the other locales files.
locales:
	grunt locales

# This will collect every transfer's type to create a translation key
transferstypes:
	grunt	transferstypes

# This will import every google spreadsheet according to server/config/clubs.json
gss:
	grunt gss
