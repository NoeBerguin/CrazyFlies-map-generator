FROM node:16.13.0 as build-step
WORKDIR /app
COPY ./ /app
RUN npm install -g npm@latest
RUN npm install -g @angular/cli
EXPOSE 4200
RUN npm install
ENV PORT=4200
CMD ["npm", "start"]
