/* eslint-disable prettier/prettier */
/* eslint-disable operator-linebreak */
const data = require('../../lib/data');
const { hash, parseJSON } = require('../../helper/utilities');

const handler = {};

handler.userHandler = (requestedProperties, callback) => {
  const acceptedMethods = ['get', 'post', 'put', 'delete'];
  if (acceptedMethods.indexOf(requestedProperties.method) > -1) {
    handler.users[requestedProperties.method](requestedProperties, callback);
  } else {
    callback(405);
  }
};

handler.users = {};

handler.users.post = (requestedProperties, callback) => {
  const firstName =
    typeof requestedProperties.body.firstName === 'string' &&
    requestedProperties.body.firstName.trim().length > 0
      ? requestedProperties.body.firstName.trim()
      : false;

  const lastName =
    typeof requestedProperties.body.lastName === 'string' &&
    requestedProperties.body.lastName.trim().length > 0
      ? requestedProperties.body.lastName.trim()
      : false;
  const phone =
    typeof requestedProperties.body.phone === 'string' &&
    requestedProperties.body.phone.trim().length === 11
      ? requestedProperties.body.phone.trim()
      : false;

  const password =
    typeof requestedProperties.body.password === 'string' &&
    requestedProperties.body.password.trim().length > 0
      ? requestedProperties.body.password.trim()
      : false;
  const tosAgreement =
    typeof requestedProperties.body.tosAgreement === 'boolean' &&
    requestedProperties.body.tosAgreement
      ? requestedProperties.body.tosAgreement
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    // make sure user does not exist in db
    data.read('users', phone, (error) => {
      if (error) {
        // prepare user object
        const userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };

        // store user object to db

        data.create('users', phone, userObject, (err) => {
          if (!err) {
            callback(200, { message: 'User is created successfully' });
          } else {
            callback(500, { error: 'Could not created user!' });
          }
        });
      } else {
        callback(500, {
          error: 'User already exist with this phone number',
        });
      }
    });
  } else {
    callback(400, {
      error: 'Invalid request. Please check the request data.',
    });
  }
};
handler.users.get = (requestedProperties, callback) => {
  const phone =
    typeof requestedProperties.queryStringObject.phone === 'string' &&
    requestedProperties.queryStringObject.phone.trim().length === 11
      ? requestedProperties.queryStringObject.phone.trim()
      : false;

  if (phone) {
    data.read('users', phone, (err, u) => {
      if (!err && u) {
        const user = parseJSON(u);
        delete user.password;
        callback(200, user);
      } else {
        callback(404, { error: 'User not found!' });
      }
    });
  } else {
    callback(404, { error: 'User not found!' });
  }
};
handler.users.put = (requestedProperties, callback) => {
  const phone =
    typeof requestedProperties.body.phone === 'string' &&
    requestedProperties.body.phone.trim().length === 11
      ? requestedProperties.body.phone.trim()
      : false;
  const firstName =
    typeof requestedProperties.body.firstName === 'string' &&
    requestedProperties.body.firstName.trim().length > 0
      ? requestedProperties.body.firstName.trim()
      : false;

  const lastName =
    typeof requestedProperties.body.lastName === 'string' &&
    requestedProperties.body.lastName.trim().length > 0
      ? requestedProperties.body.lastName.trim()
      : false;

  const password =
    typeof requestedProperties.body.password === 'string' &&
    requestedProperties.body.password.trim().length > 0
      ? requestedProperties.body.password.trim()
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      data.read('users', phone, (err, u) => {
        const userData = parseJSON(u);
        if (!err && userData) {
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          if (password) {
            userData.password = hash(password);
          }

          // now update database with latest data

          data.update('users', phone, userData, (error) => {
            if (!error) {
              callback(200, { message: 'User update succesfully' });
            } else {
              callback(500, {
                error:
                  'User update failed. Please double check your request param!',
              });
            }
          });
        } else {
          callback(400, {
            error: 'Invalid request. Please double check your request param!',
          });
        }
      });
    } else {
      callback(400, { error: 'Invalid request. Please try again!' });
    }
  } else {
    callback(400, { error: 'Invalid phone number. Please try again!' });
  }
};
handler.users.delete = (requestedProperties, callback) => {
    // console.log(requestedProperties);
  const phone =
    typeof requestedProperties.queryStringObject.phone === 'string' &&
    requestedProperties.queryStringObject.phone.trim().length === 11
      ? requestedProperties.queryStringObject.phone.trim()
      : false;

      console.log(phone);
  if (phone) {
    data.read('users', phone, (err, user) => {
      if (!err && user) {
        data.delete('users', phone, (error) => {
          if (!error) {
            callback(200, { message: 'User has deleted Successfully.' });
          } else {
            callback(500, {
              message: 'User has not deleted. Please try again',
            });
          }
        });
      } else {
        callback(500, { error: 'User deletation failed' });
      }
    });
  } else {
    callback(400, { error: 'There was a problem with your request' });
  }
};

module.exports = handler;
