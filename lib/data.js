const fs = require('fs');
const path = require('path');

const lib = {};

lib.basedir = path.join(__dirname, '/../.data/');

// write data to file

lib.create = (dir, file, data, callback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData, (er) => {
                if (!er) {
                    fs.close(fileDescriptor, (error) => {
                        if (!error) {
                            callback(false);
                        } else {
                            callback(error);
                        }
                    });
                } else {
                    callback(er);
                }
            });
        } else {
            callback(err);
        }
    });
};
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf-8', (err, data) => {
        callback(err, data);
    });
};

lib.update = (dir, file, data, callback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);
            fs.truncate(fileDescriptor, (err) => {
                if (!err) {
                    // write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, (error) => {
                        if (!error) {
                            fs.close(fileDescriptor, (er) => {
                                if (!er) {
                                    callback(false);
                                } else {
                                    callback('Error closing file');
                                }
                            });
                        } else {
                            callback('Error while writing to file');
                        }
                    });
                } else {
                    callback('Error truncating file!');
                }
            });
        } else {
            console.log('Error updating file. File may not exist');
        }
    });
};

lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false);
        } else {
            callback('Error deleting file');
        }
    });
};
module.exports = lib;
