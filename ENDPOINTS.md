# Endpoint Documentation

### All links are prefixed with https://modwatchapi-ansballard.rhcloud.com

---

- [/api/user/:username/file/:filetype](https://modwatchapi-ansballard.rhcloud.com/api/user/:username/file/:filetype)
  - plugins, modlist, ini, prefsini
  - returns an array of strings, which is just the given file split on newlines
```json
[
"Update.esm",
"Dawnguard.esm",
...
]
```
- [/api/user/:username/rawfile/:filetype](https://modwatchapi-ansballard.rhcloud.com/api/user/:username/rawfile/:filetype)
  - plugins, modlist, ini, prefsini
  - returns a text dump
```
Update.esm
Dawnguard.esm
...
```
- [/api/user/:username/profile](https://modwatchapi-ansballard.rhcloud.com/api/user/:username/profile)
  - returns a json object with all info displayed on a modwat.ch modlist page
```json
{
"game": "skyrim",
"tag": "Description",
"timestamp": Date,
"enb": "Pilgrim"
}
```
- [/api/user/:username/files](https://modwatchapi-ansballard.rhcloud.com/api/user/:username/files)
  - returns an array of strings, which is the available file types for the given user
```json
[
"plugins",
"modlist",
"ini",
"prefsini"
]
```
- [/api/users/count](https://modwatchapi-ansballard.rhcloud.com/api/users/count)
  - returns the number of modlists on modwatch as plaintext
- [/api/users/list](https://modwatchapi-ansballard.rhcloud.com/api/users/list)
  - returns an array of objects, `{username,score,timestamp,game}`
  - game defaults to skyrim classic
```json
[{
"username": "Peanut",
"game": "skyrim",
"timestamp": Date
},
...
]
```
- [/api/users/list/:limit](https://modwatchapi-ansballard.rhcloud.com/api/users/list/:limit)
  - same as above, but takes a limit. Will replace the above in the next site update

### WIP, More to Come
