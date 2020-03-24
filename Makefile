.PHONY: build test log

LOG_TAIL := $(if $(tail),$(tail),"all")
BUILD_CACHE_STATE := $(if $(no-cache),--no-cache,)
CONTAINER := $(if $(container),$(container))
SHELL_CONTAINER := $(if $(container),$(container),app)
BACKGROUND_START := $(if $(fg),,-d)
DEPS := $(if $(packages),$(packages),)
MIGRATION_NAME = ""

all: clean stop build install

re: down all

build:
	docker-compose build ${BUILD_CACHE_STATE} ${CONTAINER}

start:
	docker-compose up ${BACKGROUND_START} ${CONTAINER}

stop:
	docker-compose stop ${CONTAINER}

down:
	docker-compose down -v

log:
	docker-compose logs -f -t --tail=${LOG_TAIL} ${CONTAINER}

ps:
	docker-compose ps

shell:
	docker-compose run --rm ${SHELL_CONTAINER} sh

clean:
	rm -rf node_modules public .sass-cache .tmp dist client/bower_components

install:
	docker-compose run --rm ${SHELL_CONTAINER} npm install

test:
	docker-compose -f docker-compose.test.yml run --rm test                                                                                                                                                                       tech-docker-compose ✭ ◼

migrate-create:
	docker-compose run --rm app npm run migration:create

migrate-generate:
	docker-compose run --rm app npm run migration:generate ${MIGRATION_NAME}

migrate-run-dev:
	docker-compose run --rm app npm run migration:run

migrate-run-prod:
	docker-compose run --rm app npm run migration:run:prod
