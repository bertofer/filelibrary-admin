#/bin/sh
# This is an example file. Copy it to your folder and fill the env variables of
# your environment.

export NAME=filelibrary-admin
export APP_PORT=
export SERVER_ADDRESS=""
export FILES_FOLDER_INSIDE_ADMIN=""
export FILES_FOLDER_OUTSIDE_ADMIN=""

docker stop $NAME
docker rm $NAME

docker run -d  \
--expose $APP_PORT \
-v $FILES_FOLDER_INSIDE_ADMIN:$FILES_FOLDER_OUTSIDE_ADMIN:rw \ #We share the folder to serve files directly with nginx
-e SERVER_PROTOCOL='' \
-e SERVER_ADDRESS=$SERVER_ADDRESS \
-e APP_PORT=$APP_PORT \
-e TEMP_DIR="" \
-e FINAL_DIR=$FILES_FOLDER \
-e AUTHOR="" \
-e WEBSEED_ADDRESS="" \
-e WEBSEED_PORT=324 \
-e TRACKER_ADDRESS="" \
-e TRACKER_PORT=423 \
-e DB_PATH="" \
--name $NAME \
albertoferbcn/filelibrary-admin
