import express from 'express';

import authentication from './auth';
import admins from './admins';
import users from './users';
import settings from './settings';
// import features from './features';

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  admins(router);
  users(router);
  settings(router);


  // features(router);

  // app.use("/api/clear", clearstrike);

  // app.use("/api/find/:id", findMember);

  // app.use("/api/strikes", getStrikes)

  // app.get('/api/strikes', getStrikedMembers);

  return router;
};