#/bin/sh
# This is an example file. Copy it to your folder and fill the env variables of
# your environment.
export APP_PORT=

docker run -p 80:$APP_PORT \
--expose $APP_PORT \
-e SERVER_PROTOCOL='http | https' \
-e SERVER_ADDRESS="" \
-e APP_PORT=$APP_PORT \
-e TEMP_DIR="" \
-e FINAL_DIR="" \
-e AUTHOR="" \
-e WEBSEED_ADDRESS="" \
-e WEBSEED_PORT=324 \
-e TRACKER_ADDRESS="" \
-e TRACKER_PORT=423 \
-e DB_PATH="" \
albertoferbcn/filelibrary-admin
