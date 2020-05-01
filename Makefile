install:
	npm install
	cd client && npm install

develop:
	npm run dev

deploy:
	git push heroku master

datakill:
	git co -- app/data/
