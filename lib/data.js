const fs = require('fs');
const path = require('path');

const lib = {};

lib.basedir = path.join(__dirname, '/..data/');

// write data to file

lib.create = function (dir, file, data, callback) {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error closing the new file');
                        }
                    });
                } else {
                    callback('Error in creating new file');
                }
            });
        } else {
            callback('File creation failed');
        }
    });
};
