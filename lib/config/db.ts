module.exports = ({
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
    : env === "development"
      ? `mongodb://${username}:${password}@ds051873.mlab.com:51873/modwatchdev`
      : "localhost:27017/modwatch";
