import Modlist from "../modlist";
import { validFiletype } from "./utils";

export default function search(app) {
  app.get("/api/search/file/:filetype/:querystring", (req, res) => {
		if(validFiletype(req.params.filetype)) {
			const filetypeJSON = {username: 1};
			filetypeJSON[req.params.filetype] = 1;
			Modlist.find({}, filetypeJSON, (err, users) => {
				if(err) {
					res.sendStatus(500);
				} else {
					const toReturn = [];
					const queryLower = req.params.querystring.toLowerCase();
					let fileLower;
					for(let i = 0; users && i < users.length; i++) {
						users[i].shrinkArrays();
						for(let j = 0; j < users[i][req.params.filetype].length; j++) {
							fileLower = users[i][req.params.filetype][j].toLowerCase();
							if(fileLower.indexOf(queryLower) >= 0) {
								toReturn.push(users[i].username);
								break;
							}
						}
					}
					res.json({users: toReturn, length: toReturn.length});
				}
			});
		} else {
			res.sendStatus(500);
		}
  });
}
