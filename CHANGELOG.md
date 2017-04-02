# Changelog

## 1.5.0 (04/02/2017)

**Implemented Enhancements**

- Added `helmet` and `compression`
- removed es6 modules and babel transpilation
- removed `methodoverride` and extra `cors()` call

**Bugs**

- don't pass jwt, just require in each file
- little cleaning things

## 1.4.0 (11/27/2016)

**Implemented Enhancements**

- Added a route for changing passwords from the uploader
- Return game data in user list endpoint
- Added yarn
- better local dev scripts

**Bugs**

- cleaning use stricts
- moved models to folder
- fixed eslint

## 1.3.2 (10/13/2016)

**Implemented Enhancements**

- none

**Bugs**

- fixed limited users search route, had to cast to int

## 1.3.1 (9/28/2016)

**Implemented Enhancements**

- none

**Bugs**

- fixed limited users list route, had to cast to int

## 1.3.0 (8/21/2016)

**Implemented Enhancements**

- added changepass route

**Bugs**

- fixed some unsanitized routes (injection issues)
- catch some exceptions when passwords aren't valid

## 1.2.1 (8/8/2016)

**Implemented Enhancements**

- none

**Bugs**

- added newUsers in file search so I can move it to the userlist view

## 1.2.0 (8/8/2016)

**Implemented Enhancements**

- added a users list route with a limit param
- added a user list search route

**Bugs**

- search files now uses actual mongo queries (20x faster)

## 1.1.2 (5/8/2016)

**Implemented Enhancements**

- none

**Bugs**

- upload failure wasn't showing

## 1.1.1 (5/8/2016)

**Implemented Enhancements**

- split routes.js into the routes folder
- package.json engine is now the openshift version
- add /health for new node

**Bugs**

- none

## 1.1.0 (5/7/2016)

**Implemented Enhancements**

- Replace gulp with custom build scripts
  - custom watch with ora
  - clean stop on keypress
  - rollup
  - transpile build script for old node
- refactor source to es6
  - const/let
  - arrow functions
  - es6 modules
  - concat to single output file
- Express Changes
  - consistent method use
    - sendStatus, end(msg),
  - eslint passing

**Bugs**

- need to replace `bcrypt-nodejs`, monkeypatched for now
- changed `auth/:username/remove` to `api/user/:username/delete`
  - original didn't work, works now, tested with cli

## 1.0.2 ()

**Implemented Enhancements**

- Added babel
- Moved built node files to `/dist/`
- Added `server.js` to call node files from root directory
- Added lint warning for unhandled errors in callbacks

## 1.0.1 (9/30/2015)

**Implemented Enhancements**

- Added Changelog
- Added Readme
