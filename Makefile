install:
	npm install
	cd client && npm install

start:
	npm run dev

datakill:
	git co -- app/data/
