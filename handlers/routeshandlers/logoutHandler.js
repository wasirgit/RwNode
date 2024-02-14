const tokenHandler = require("./tokenHandler");
const data = require("../../lib/data");

const handler = {};

handler.logoutHandler = (requestedProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestedProperties.method) > -1) {
    handler.logout[requestedProperties.method](requestedProperties, callback);
  } else {
    callback(405);
  }
};

handler.logout = {};

handler.logout.post = (requestedProperties, callback) => {
  const phone =
    typeof requestedProperties.body.phone === "string" &&
    requestedProperties.body.phone.trim().length === 11
      ? requestedProperties.body.phone.trim()
      : false;

  const token =
    typeof requestedProperties.headerObject.token === "string"
      ? requestedProperties.headerObject.token
      : false;
  console.log(`logout event fired`);

  //   tokenHandler._token.verify(token, phone, (isValidToken) => {

  tokenHandler._token.verify(token, phone, (isValidToken) => {
    if (isValidToken) {
      data.delete("tokens", token, (err) => {
        if (!err) {
          callback(200, { message: "Success" });
        } else {
          callback(403, { error: "Internal error has happened" });
        }
      });
    } else {
      callback(403, { error: "Authentication error" });
    }
  });
};

module.exports = handler;
