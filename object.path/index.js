'use strict';

module.exports = (NODE) => {
  const jsonPath = require('jsonpath');

  const objsIn = NODE.getInputByName('objects');

  const objsOut = NODE.getOutputByName('objects');
  objsOut.on('trigger', async (conn, state) => {
    const { path } = NODE.data;
    if (!path) {
      return;
    }

    // test the given path
    try {
      jsonPath.parse(path);
    } catch (err) {
      NODE.error(
        err,
        state
      );
      return;
    }

    // run the path on the input objects
    const objs = await objsIn.getValues(state);
    return objs
    .filter((obj) => obj != null)
    .map((obj) => jsonPath.query(obj, path))
    .flat();
  });
};
