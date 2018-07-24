const supportedFiletypes: Modwatch.FileNames[] = [
	"plugins",
	"modlist",
	"ini",
	"prefsini"
];
exports.supportedFiletypes = supportedFiletypes;

exports.validFiletype = validFiletype;;
function validFiletype(
  filetype: File
): boolean {
  return supportedFiletypes.includes(filetype);
};

// exports.tokenEnsureAuthorized = function(req, res, next) {
// 	let bearerToken;
// 	const bearerHeader = req.headers.authorization;
// 	if (typeof bearerHeader !== "undefined") {
// 		const bearer = bearerHeader.split(" ");
// 		bearerToken = bearer[1];
// 		req.token = bearerToken;
// 		next();
// 	} else {
// 		res.sendStatus(403);
// 	}
// }
