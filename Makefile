CURRENT_DIR=$(shell pwd)

APP=$(shell basename ${CURRENT_DIR})

APP_CMD_DIR=${CURRENT_DIR}/cmd

REGISTRY=gitlab.udevs.io:5050
TAG=latest
ENV_TAG=latest
PROJECT_NAME=macbro

build-image:
	docker build --rm -t ${REGISTRY}/${PROJECT_NAME}/${APP}:${TAG} -f ./Dockerfile-prod .
	docker tag ${REGISTRY}/${PROJECT_NAME}/${APP}:${TAG} ${REGISTRY}/${PROJECT_NAME}/${APP}:${ENV_TAG}

build-image-test:
	docker build --rm -t ${REGISTRY}/${PROJECT_NAME}/${APP}:${TAG} -f ./Dockerfile-test .
	docker tag ${REGISTRY}/${PROJECT_NAME}/${APP}:${TAG} ${REGISTRY}/${PROJECT_NAME}/${APP}:${ENV_TAG}

push-image:
	docker push ${REGISTRY}/${PROJECT_NAME}/${APP}:${TAG}
	docker push ${REGISTRY}/${PROJECT_NAME}/${APP}:${ENV_TAG}

.PHONY: proto
