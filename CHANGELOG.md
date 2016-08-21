# Changelog

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
