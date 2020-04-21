build:
	yarn run build

clean:
	rm -r .next node_modules
	
deploy:
	pm2 deploy deploy.json production

deploy-init:
	pm2 deploy deploy.json production setup
	
install:
	yarn install

run:
	yarn dev
