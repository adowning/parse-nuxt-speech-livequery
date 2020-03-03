const { ParseServer } = require("parse-server");
// const HOST_URL = process.env.HOST_URL || 'localhost'
// const port = process.env.PORT || 3000

const init = (app: any) => {
  const PORT_LIVE_QUERY = process.env.PORT_LIVE_QUERY || 2337;
  const httpServer = require("http").createServer(app);
  httpServer.listen(PORT_LIVE_QUERY);

  ParseServer.createLiveQueryServer(httpServer, {
    serverURL: `http://${process.env.HOST_URL}:${process.env.PORT}/parse`, // Don't forget to change to https if needed
    appId: process.env.APP_ID,
    masterKey: process.env.MASTER_KEY
  });
};

module.exports = { init };
