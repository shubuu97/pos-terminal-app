FROM node:6.10.3-alpine
RUN mkdir -p /aob-pos-ui
ENV APP_START_MODE_ENV=start-prod
CMD mkdir /var/log/applogs
CMD chmod +777 /var/log/applogs
WORKDIR /aob-pos-ui
ADD . /aob-pos-ui
CMD npm run ${APP_START_MODE_ENV}