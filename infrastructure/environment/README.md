# Runtime environment | Infrastructure

## Overview

為使專案順利運作，執行環境分為本地開發環境 (docker-compose-local) 及伺服器執行環境 (docker-compose-deploy)，並基於安全起見，將帳號密碼等敏感資訊以 Docker Secret 進行讀取。

## Service

### Mongo DB

本專案使用 MongoDB 作為資料庫，並以 Mongo-Express (Node.js / Express 框架) 作為網頁圖形化瀏覽介面，以便開發快速瀏覽資料庫內容，並無需安裝 Client 端應用程式。

* 主要設定參數如下 (針對 _FILE 參數皆為從 Secret 檔案讀取，因此值必須為 Secrets 路徑，並設定相關 Secret 變數)：
```
# MongoDB

    MONGO_INITDB_DATABASE: 預設儲存系統資料的資料庫
    MONGO_INITDB_ROOT_USERNAME_FILE: Root 帳號
    MONGO_INITDB_ROOT_PASSWORD_FILE: Root 密碼
    MONGO_DATABASE: 預設應用程式使用資料庫 (透過 ./mongodb/init-mongo.sh 讀取建立)
    MONGO_USERNAME_FILE: 預設應用程式使用資料庫 帳號 (透過 ./mongodb/init-mongo.sh 讀取建立)
    MONGO_PASSWORD_FILE: 預設應用程式使用資料庫 密碼 (透過 ./mongodb/init-mongo.sh 讀取建立)
# Mongo-Express
    ME_CONFIG_MONGODB_SERVER: 主機位址 (填入 Service name, 例如: mongo)
    ME_CONFIG_MONGODB_PORT: 主機埠號 (預設 27017)
    ME_CONFIG_OPTIONS_EDITORTHEME: 網頁編輯器主題 (參考: http://codemirror.net/demo/theme.html)
    ME_CONFIG_BASICAUTH_USERNAME_FILE: Web 管理介面帳號
    ME_CONFIG_BASICAUTH_PASSWORD_FILE: Web 管理介面密碼
    ME_CONFIG_MONGODB_ENABLE_ADMIN: 是否啟用管理員模式, 如果為 'false' 則要填寫下面三個參數, 否則填寫 ME_CONFIG_MONGODB_ADMINUSERNAME, ME_CONFIG_MONGODB_ADMINPASSWORD 參數, 管理員模式可查看資料庫系統狀態及各資料庫管理權限
    ME_CONFIG_MONGODB_AUTH_DATABASE: 指定資料庫登入
    ME_CONFIG_MONGODB_AUTH_USERNAME_FILE: 具該資料庫權限之 MongoDB 帳號
    ME_CONFIG_MONGODB_AUTH_PASSWORD_FILE: 具該資料庫權限之 MongoDB 密碼
    ME_CONFIG_SITE_COOKIESECRET_FILE: 網頁 Cookie 密鑰 (加密用)
    ME_CONFIG_SITE_SESSIONSECRET_FILE: 網頁 Secret 密鑰 (加密用)
```
* Secret 參數如下：
    > printf "{資料}" | docker secret create {命名變數} -

    * `mongo_root_username`: Mongo DB Root 帳號
    * `mongo_root_password`: Mongo DB Root 密碼
    * `mongo_user_username`: Mongo DB User 帳號 (僅限存取特定 DB，應用程式使用)
    * `mongo_user_password`: Mongo DB User 密碼 (僅限存取特定 DB，應用程式使用)
    * `mongo_express_admin_username`: Mongo Web 管理介面帳號 (Basic Authentication)
    * `mongo_express_admin_password`: Mongo Web 管理介面密碼 (Basic Authentication)

```shell=
# 將敏感資訊建立並儲存成 Docker secrect
printf "DB 帳號" | docker secret create mongo_root_username -
printf "DB 密碼" | docker secret create mongo_root_password -
printf "DB For Application 帳號" | docker secret create mongo_user_username -
printf "DB For Application 密碼" | docker secret create mongo_user_password -
printf "Web 介面帳號" | docker secret create mongo_express_admin_username -
printf "Web 介面帳號" | docker secret create mongo_express_admin_password -
printf "Web 介面 cookie 密鑰" | docker secret create mongo_express_cookie_secret -
printf "Web 介面 session 密鑰" | docker secret create mongo_express_session_secret -
```

## Command

### Basic
* Host swarm 環境建立 (為了使用 Secret)
```
docker swarm init
```
* 建立服務
```
# docker stack deploy -c {Docker-compose file} {服務名稱}
docker stack deploy -c docker-compose-local.yml mongodb
```
* 停止服務
```
# docker stack rm {服務名稱}
docker stack rm mongodb
```

### Others
* 查看目前 Host 已存在 Secret
```
docker secret ls
```
* 刪除目前 Host 已存在 Secret
```
docker secret rm {變數名稱}
```

## Reference

[Dockerhub - mongo](https://hub.docker.com/_/mongo)
[Dockerhub - mongo-express](https://hub.docker.com/_/mongo-express)