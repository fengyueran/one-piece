 #!/bin/bash

set -e


if [ -z "$1" ]; then
    echo "请提供一个版本号作为参数。"
    exit 1
fi

docker run --platform linux/amd64 -it fengyueran/ubuntu:$1 bash
