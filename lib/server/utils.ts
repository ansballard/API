import { Cursor } from "mongodb";
import { ServerResponse } from "microrouter";

exports.serializeStreamToJSONArray = function serializeStreamToJSONArray({
  cursor,
  res,
  serializer
}: SerializeStreamToJSONParameters): Promise<number> {
  return new Promise((resolve, reject) => {
    res.write("[");
    let first = true;
    let count = 0;
    cursor.on("readable", () => {
      let item = null;
      //@ts-ignore @type def is wrong, read() can take null
      while ((item = cursor.read()) !== null) {
        count++;
        if (!first) {
          res.write(",");
        } else {
          first = false;
        }
        res.write(serializer(item));
      }
    });
    cursor.on("end", () => {
      res.write("]");
      resolve(count);
    });
    cursor.on("error", (e: Error) => {
      throw e;
    });
  });
};

interface SerializeStreamToJSONParameters {
  cursor: Cursor;
  res: ServerResponse;
  serializer(object: any): string;
}
