# stage1: Build the React App as builder
FROM node:15.3-buster as build

WORKDIR /app

# copy the package.json to install dependencies
COPY package*.json ./
# set space size to avoid memory issues
# ENV NODE_OPTIONS=--max_old_space_size=1024

# The next lines may serve to solve dependencies issues

#RUN npm install -g node-gyp
#RUN curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
#RUN export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
# This loads nvm
#RUN [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
#RUN . ~/.profile
#RUN nvm install 16.13.2
#RUN nvm use 16.13.2
RUN npm install -g node@16.13.2 -f
RUN npm --version
RUN node --version
RUN npm install

COPY . .

# Build the project and copy the files
RUN npm run build

FROM nginx:1.21-alpine

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stage 1
COPY --from=build /app/dist /usr/share/nginx/html

#!/bin/sh

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]

# CMD ["npm", "run", "dev"]