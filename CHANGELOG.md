# Changelog

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
