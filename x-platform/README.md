# Devmeetings Slides App

## Running platform

```sh
$ npm install
$ grunt [serve|build]
```

## Xplaform plugin generator

install:

```sh
$ npm link generator-xplatform/
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
* mkdir x-platform/data
* npm install -g grunt-cli
