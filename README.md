devmeetings-slidesapp
=====================

Working example: [/xplatform.org](http://xplatform.org)

Running whole platform using Docker
--------------------
1. Install [Docker][http://docker.io]
1. On Mac OSX you can use `docker.install-osx.sh` to automate installation
1. Invoke `run.sh`
1. ???
1. You are done. Profit!

Running parts of platform using Docker
-------------------
1. Create container for specific component using snippets from `run.sh`
1. Run container e.g. `mongo`
1. Invoke `docker ps` and check exposed port.

    ```
    586b3dae23cb        xplatform/mongo:latest            mongod              3 minutes ago       Up 3 minutes        0.0.0.0:49156->27017/tcp                            mongo
    ```

1. Run platform and specify `MONGO_HOST`

    ```
    $ cd ./platform; MONGO_HOST="localhost:49156" node app
    ```
