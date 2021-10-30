# pull official base image
FROM node:14.18.1-alpine

# set working directory
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
COPY yarn.lock /usr/src/app/yarn.lock
RUN rm -rf node_modules && yarn install --frozen-lockfile
RUN yarn add global react-scripts@4.0.3 --silent
RUN yarn add global sass

# start app
CMD ["yarn", "start"]