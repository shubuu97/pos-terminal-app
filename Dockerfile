FROM node:8.15.0-alpine
RUN mkdir -p /AOB-POS-WEB-APP-V2
CMD mkdir /var/log/applogs
CMD chmod +777 /var/log/applogs
WORKDIR /AOB-POS-WEB-APP-V2
ADD . /AOB-POS-WEB-APP-V2
RUN npm install -g ecstatic
RUN npm install -g http-server
RUN npm rebuild node-sass
RUN npm run build
CMD sh cmd.sh