# set -x

rm -rf /tmp/dart_cache/cache.tar.gz

FILES="./packages .packages pubspec.lock .pub"

tar cjf cache.tar.gz $FILES
rm -rf $FILES

mkdir -p /tmp/dart_cache/
cp cache.tar.gz /tmp/dart_cache/

