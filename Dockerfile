FROM node:8
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# RUN npm install
# If you are building your code for production
 RUN npm install --only=production

# Bundle app source
COPY . .

#ENV IP="192.168.99.100"

# Entrypoint script
# RUN cp docker-entrypoint.sh /usr/local/bin/ && \
#    chmod +x /usr/local/bin/docker-entrypoint.sh
# RUN npm run build

#EXPOSE 3000
EXPOSE 4000
#EXPOSE 5000

# ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

CMD [ "node", "server/server.js" ]
