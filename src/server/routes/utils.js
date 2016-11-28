const supportedFiletypes = [
	"plugins",
	"modlist",
	"ini",
	"prefsini",
	"skse",
	"enblocal"
];

export function validFiletype(filetype) {
	return supportedFiletypes.indexOf(filetype) >= 0;
}

export function tokenEnsureAuthorized(req, res, next) {
	let bearerToken;
	const bearerHeader = req.headers.authorization;
	if (typeof bearerHeader !== "undefined") {
		const bearer = bearerHeader.split(" ");
		bearerToken = bearer[1];
		req.token = bearerToken;
		next();
	} else {
		res.sendStatus(403);
	}
}
