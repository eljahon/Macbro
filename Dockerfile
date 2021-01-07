FROM nginx as production-stage
EXPOSE 8080
RUN mkdir /app
COPY ./dist /app
COPY nginx.conf /etc/nginx/nginx.conf