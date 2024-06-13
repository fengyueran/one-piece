 #!/bin/bash

set -e


if [ -z "$1" ]; then
    echo "请提供一个版本号作为参数。"
    exit 1
fi

docker buildx build --platform linux/amd64 -t fengyueran/ubuntu:$1 -f docker-files/ubuntu-docker-file --load .
# docker push fengyueran/ubuntu:$1