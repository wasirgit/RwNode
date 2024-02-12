const data = require("../../lib/data");
const {
  hash,
  parseJSON,
  createRandomString,
} = require("../../helper/utilities");

const handler = {};

handler.tokenHandler = (requestedProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestedProperties.method) > -1) {
    handler._token[requestedProperties.method](requestedProperties, callback);
  } else {
    callback(405);
  }
};

handler._token = {};

handler._token.post = (requestedProperties, callback) => {
  const phone =
    typeof requestedProperties.body.phone === "string" &&
    requestedProperties.body.phone.trim().length === 11
      ? requestedProperties.body.phone
      : false;

  const password =
    typeof requestedProperties.body.password === "string" &&
    requestedProperties.body.password.trim().length > 0
      ? requestedProperties.body.password
      : false;

  if (phone && password) {
    data.read("users", phone, (error, userData) => {
      if (!error && userData) {
        const user = parseJSON(userData);
        const hashedPassFromUser = hash(password);
        const hashedpassFromDb = user.password;
        if (hashedPassFromUser === hashedpassFromDb) {
          const tokenId = createRandomString(20);
          const expires = Date.now() + 60 * 60 * 1000;
          const tokenObject = {
            phone,
            tokenId,
            expires,
          };
          data.create("tokens", tokenId, tokenObject, (err) => {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(500, {
                error: "There was a problem in the server side!",
              });
            }
          });
        } else {
          callback(400, {
            error: "Password is not correct",
          });
        }
      } else {
        callback(400, {
          error: "Phone is not correct",
        });
      }
    });
  } else {
    callback(400, {
      error: "Please check your request. ",
    });
  }
};
handler._token.get = (requestedProperties, callback) => {
  const id =
    typeof requestedProperties.queryStringObject.id === "string" &&
    requestedProperties.queryStringObject.id.trim().length === 20
      ? requestedProperties.queryStringObject.id
      : false;

  if (id) {
    // get the token
    data.read("tokens", id, (error, token) => {
      if (!error && token) {
        const tokenData = parseJSON(token);
        callback(200, tokenData);
      } else {
        callback(404, { error: "Request token is not found" });
      }
    });
  } else {
    callback(404, { error: "Request token is not found." });
  }
};
handler._token.put = (requestedProperties, callback) => {
  const id =
    typeof requestedProperties.body.id === "string" &&
    requestedProperties.body.id.trim().length === 20
      ? requestedProperties.body.id
      : false;
  const extend = !!(
    typeof requestedProperties.body.extend === "boolean" &&
    requestedProperties.body.extend === true
  );

  if (id && extend) {
    data.read("tokens", id, (err, tData) => {
      if (!err && tData) {
        const tokenObject = parseJSON(tData);
        if (tokenObject.expires > Date.now()) {
          tokenObject.expires = Date.now() + 60 * 60 * 1000;
          data.update("tokens", id, tokenObject, (err2) => {
            if (!err2) {
              callback(200, { message: "Token expire time updated" });
            } else {
              callback(500, {
                error: "Internal server error. Please check your request",
              });
            }
          });
        } else {
          callback(400, {
            error: "Token already expires",
          });
        }
      } else {
        callback(404, { error: "There is a problem in your request" });
      }
    });
  } else {
    callback(400, { error: "There is a problem in your request" });
  }
};
handler._token.delete = (requestedProperties, callback) => {
  const id =
    typeof requestedProperties.queryStringObject.id === "string" &&
    requestedProperties.queryStringObject.id.trim().length === 20
      ? requestedProperties.queryStringObject.id
      : false;

  if (id) {
    // look up the tokens

    data.read("tokens", id, (error, tokenData) => {
      const tokenObject = parseJSON(tokenData);

      if (!error && tokenData) {
        data.delete("tokens", id, (err) => {
          if (!err) {
            callback(200, { message: "Token was successfully deleted!" });
          } else {
            callback(500, { message: "Internal server error" });
          }
        });
      } else {
        callback(400, {
          message:
            "There is a problem in your request data. Please check again. ",
        });
      }
    });
  } else {
    callback(404, {
      message: "Token NOT found ",
    });
  }
};

handler._token.verify = (id, phone, callback) => {
  data.read("tokens", id, (err, tokenData) => {
    if (!err && tokenData) {
      const tokenObject = parseJSON(tokenData);

      if (tokenObject.phone === phone && tokenObject.expires > Date.now()) {
        console.log(`tokenObject: true`);
        callback(true);
      } else {
        console.log(`tokenObject: false`);
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

module.exports = handler;
