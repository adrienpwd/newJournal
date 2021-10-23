# pull official base image
FROM node:14.18.1-alpine

# set working directory
WORKDIR /usr/src/app

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
COPY yarn.lock /usr/src/app/yarn.lock
RUN rm -rf node_modules && yarn install --frozen-lockfile

# start app
CMD ["yarn", "start"]