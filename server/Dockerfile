# Check out https://hub.docker.com/_/node to select a new base image
# FROM node:10-slim
FROM node:15.3-buster AS build

# Set to a non-root built-in user `node`
# USER node

# Create app directory (with user `node`)
# RUN mkdir -p /home/node/app

# WORKDIR /home/node/app
WORKDIR /usr/src/app

#RUN npm install -g node-gyp
#RUN curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
#RUN export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
# This loads nvm
#RUN [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
#RUN . ~/.profile
#RUN nvm install 16.13.2
#RUN nvm use 16.13.2
# RUN npm install -g node@16.13.2
RUN npm --version
RUN node --version
# RUN npm install

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node package*.json ./

RUN npm install

# Bundle app source code
COPY --chown=node . .

RUN npm run build
RUN mv docker_start.sh ..

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3001

EXPOSE ${PORT}
# CMD [ "node", "." ]
CMD ["sh", "../docker_start.sh"]