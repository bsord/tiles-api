<h1 align="center">
  Tiles API
</h1>

![Docker Cloud Automated build](https://img.shields.io/docker/cloud/automated/bsord/tiles-api.svg)
![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/bsord/tiles-api.svg)
![GitHub top language](https://img.shields.io/github/languages/top/bsord/tiles-api.svg)
![Docker Pulls](https://img.shields.io/docker/pulls/bsord/tiles-api.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/bsord/tiles-api.svg)

Backend API for [Tiles](https://github.com/bsord/tiles-client); helps with creating/saving boards, authenticating users and managing chatrooms.

## Getting Started

#### Prerequisites

The following will need to be installed before proceeding:

- Node v14+
- Mongo DB
- Docker compose
- [Tiles Client](https://github.com/bsord/tiles-client)

#### Clone the Project

```sh
# Clone it
git clone https://github.com/bsord/tiles-api.git
cd tiles-api/
```

#### Launch project with docker-compose

The Tiles API can also be launched via Docker-Compose using the following example:

```sh
MongoURI='mongodb://username:pass@host.io:27017/database' docker-compose up -d
```

The Tiles API should now be serving requests at http://localhost:4001


