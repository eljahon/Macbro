FROM node:10.19.0 as builder
RUN apt update && apt-get install -y yarn

RUN mkdir app
WORKDIR app

COPY package*.json ./
RUN yarn install


COPY . ./
RUN yarn build

FROM nginx:1.18
RUN mkdir /app
COPY --from=builder /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
