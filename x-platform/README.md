# Devmeetings Slides App

## Running platform

```sh
$ npm start
```

## Building for production
```sh
$ npm run build
```

## Linting & Testing
```sh
$ npm run test
```

## Xplaform plugin generator

install:

```sh
$ npm link tools/generator-xplatform/
```

usage:

```sh
$ yo xplatform:plugin "your_plugin_name"
```

## Admin user in development

The best way to create admin is is to log in and add priveledges in mongo console:

```
db.users.update({}, {$set: { acl: [
  "student",
  "admin:slides",
  "trainer",
  "admin:events",
  "admin:super"] }})
```


## What's needed

* GIT
* MongoDB
* Redis
* npm install -g gulp
