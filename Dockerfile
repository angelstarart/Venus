FROM almalinux:latest AS os
LABEL authors="venus"

ARG user
ARG pass

RUN dnf -y update \
    && dnf install 'dnf-command(config-manager)' -y \
    && dnf config-manager --set-enabled crb \
    && dnf makecache \
    && dnf install -y epel-release \
    && dnf upgrade -y \
    && dnf config-manager --add-repo https://developer.download.nvidia.com/compute/cuda/repos/rhel9/x86_64/cuda-rhel9.repo \
    && dnf makecache \
    && dnf module install nvidia-driver -y \
    && dnf -y groupinstall 'Development Tools' \
    && dnf install -y sudo bind procps-ng rsyslog-logrotate postfix s-nail wget freeglut-devel libX11-devel libXi-devel libXmu-devel make mesa-libGLU-devel freeimage-devel glfw-devel \
    && /usr/sbin/rndc-confgen -a -b 512 -k rndc-key \
    && chmod 755 /etc/rndc.key \
    && useradd -m -s /bin/bash $user \
    && echo $user:$pass | chpasswd \
    && echo "$user ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

RUN curl -L -O "https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-$(uname)-$(uname -m).sh"
RUN bash Miniforge3-$(uname)-$(uname -m).sh -b -p /opt/conda
ENV PATH="/opt/conda/bin:${PATH}"
RUN conda init bash \
    && conda config --set always_yes yes --set changeps1 no \
    && conda update -q conda \
    && echo "conda activate base" >> /home/$user/.bashrc

WORKDIR /usr/src/app


#EXPOSE 53/UDP
#EXPOSE 53/TCP
EXPOSE 8008

CMD ["/usr/sbin/init"]


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

USER root
ENV PATH="/home/linuxbrew/.linuxbrew/bin:/home/linuxbrew/.linuxbrew/sbin:${PATH}"
RUN git config --global --add safe.directory /home/linuxbrew/.linuxbrew/Homebrew \
    && brew update \
    && brew install nvm node yarn pyenv

WORKDIR /usr/src/app
COPY package.json .
COPY ./packages/client/package.json packages/client/
COPY ./packages/server/package.json packages/server/
RUN yarn install
COPY . .

EXPOSE 3000

CMD ["yarn", "virtual"]
