install:
	npm install
	cd client && npm install

start.dev:
	npm run dev

deploy:
	git push heroku master

datakill:
	git co -- app/data/
