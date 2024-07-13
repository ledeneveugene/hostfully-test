FROM mcr.microsoft.com/devcontainers/javascript-node:0-20

ARG NODE_HOME=/home/node
ARG PNPM_VERSION=7.32.4

COPY ./.bash_aliases $NODE_HOME
COPY ./bootstrap.sh $NODE_HOME


RUN \
  umask 0002 \
  && chown node:node $NODE_HOME/.bash_aliases $NODE_HOME/bootstrap.sh \

  # install default nvm version
  && . $NVM_DIR/nvm.sh \
  && nvm install lts/* \
  && nvm alias default lts/hydrogen \
  && su - node -c "wget -qO- https://get.pnpm.io/install.sh | env PNPM_VERSION=$PNPM_VERSION bash -"
