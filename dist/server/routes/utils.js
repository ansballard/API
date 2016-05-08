"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.validFiletype = validFiletype;
exports.tokenEnsureAuthorized = tokenEnsureAuthorized;
var supportedFiletypes = ["plugins", "modlist", "ini", "prefsini", "skse", "enblocal"];

function validFiletype(filetype) {
	return supportedFiletypes.indexOf(filetype) >= 0;
}

function tokenEnsureAuthorized(req, res, next) {
	var bearerToken = void 0;
	var bearerHeader = req.headers.authorization;
	if (typeof bearerHeader !== "undefined") {
		var bearer = bearerHeader.split(" ");
		bearerToken = bearer[1];
		req.token = bearerToken;
		next();
	} else {
		res.sendStatus(403);
	}
}