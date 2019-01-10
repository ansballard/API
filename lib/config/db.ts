export const config = ({
  username,
  password,
  env
}: {
  username: string;
  password: string;
  env: string;
}) =>
  env === "production"
    ? `mongodb://${username}:${password}@ds037283.mlab.com:37283/modwatch`
    : "mongodb://localhost:27017/modwatch";
