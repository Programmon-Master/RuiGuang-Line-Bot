local.mongo.up:
	docker-compose -f infrastructure/environment/docker-compose-local.yml up -d

local.mongo.down:
	docker-compose -f infrastructure/environment/docker-compose-local.yml down

local.up:
	node server.js
