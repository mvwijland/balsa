#!/usr/bin/env sh

rm balsa.tar.gz 2> /dev/null
FILENAME="balsa.tar.gz"
echo "Releasing ${FILENAME}"
tar -czf ${FILENAME} -X ./.tarignore .
