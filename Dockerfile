FROM node:12

WORKDIR /usr/src/app

COPY EmployeeDB/package*.json ./

RUN npm install

COPY EmployeeDB/. .

EXPOSE 3000

CMD [ "node", "app.js" ]