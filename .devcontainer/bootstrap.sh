#!/bin/bash

curl https://raw.githubusercontent.com/GitAlias/gitalias/main/gitalias.txt -o "$HOME/gitalias.txt"

# ls -a -l ~

# git
git config --global --remove-section credential

git config --global user.name "$GIT_USER_NAME"
git config --global user.email "$GIT_USER_EMAIL"
git config --global include.path ~/gitalias.txt
git config --global pull.rebase true

# pnpm
# wget -qO- https://get.pnpm.io/install.sh | env PNPM_VERSION=$PNPM_VERSION bash -
# . ~/.bashrc

# report
echo "\nBootstrap report:"
whoami
pwd
echo $HOME
pnpm -v
cat ~/.gitconfig

