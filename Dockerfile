FROM node:18-alpine As build
ARG BUILD_CONTEXT

WORKDIR /base
COPY package.json .
COPY yarn.lock .
COPY ./packages/common ./packages/common
COPY ./packages/$BUILD_CONTEXT/package.json ./packages/$BUILD_CONTEXT/

RUN yarn install

COPY ./packages/common ./packages/common
COPY ./packages/$BUILD_CONTEXT ./packages/$BUILD_CONTEXT
RUN yarn build
RUN yarn build:common


FROM node:18-alpine As runner
ARG BUILD_CONTEXT

WORKDIR /app/packages/$BUILD_CONTEXT

#Common files
COPY --from=build /base/packages/common ../common

#App files
COPY --from=build /base/packages/$BUILD_CONTEXT/node_modules ./node_modules
COPY --from=build /base/packages/$BUILD_CONTEXT/dist ./dist
COPY --from=build /base/packages/$BUILD_CONTEXT/package.json ./package.json

#Yarn workspace
COPY --from=build /base/package.json ../../package.json

#Link the common package to the app
RUN yarn

CMD ["yarn", "start:prod"]
