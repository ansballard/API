exports.roles = [
  {
    key: "upload",
    expDiff: 3600 * 1000 * (24 * 30),
    origins: [encodeURIComponent("http://uploader.modwat.ch/")]
  },
  {
    key: "admin",
    expDiff: 3600 * 1000,
    origins: [
      encodeURIComponent("https://modwat.ch"),
      encodeURIComponent("http://uploader.modwat.ch/")
    ]
  },
  {
    key: "default",
    expDiff: 3600 * 1000,
    origins: [
      encodeURIComponent("https://modwat.ch"),
      encodeURIComponent("http://uploader.modwat.ch/")
    ]
  }
];
