FROM almalinux:latest AS web

RUN dnf -y update \
    && dnf install 'dnf-command(config-manager)' -y \
    && dnf config-manager --set-enabled crb \
    && dnf makecache \
    && dnf -y groupinstall 'Development Tools' \
    && dnf install -y sudo procps-ng \
    && useradd -m -s /bin/bash linuxbrew  \
    && echo 'linuxbrew ALL=(ALL) NOPASSWD:ALL' >>/etc/sudoers

USER linuxbrew
RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

ENV PATH="/home/linuxbrew/.linuxbrew/bin:/home/linuxbrew/.linuxbrew/sbin:${PATH}"
RUN git config --global --add safe.directory /home/linuxbrew/.linuxbrew/Homebrew \
    && eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)" \
    && brew update \
    && brew install nvm node yarn pyenv certbot
RUN brew list

WORKDIR /home/ec2-user/venus
COPY --chown=linuxbrew:linuxbrew . .
RUN yarn install
RUN ls -al

EXPOSE 3000
EXPOSE 443

CMD ["yarn", "server"]
