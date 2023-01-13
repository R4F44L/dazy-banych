FROM node:16

# Create app directory
WORKDIR /home/node/app

COPY package*.json ./

RUN npm i

# COPY . .


# CMD ["npm", "run", "dev"]