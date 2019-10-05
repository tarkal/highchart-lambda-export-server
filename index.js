// Include the exporter module
const exporter = require('highcharts-export-server');

exports.handler = async (event) => {

    // Just for logging
    console.log(event);

    // The async request MUST be placed in a promise otherwise highcharts returns an undefined res
    const promise = new Promise(function(resolve, reject) {

        // Export settings passed in dynamically from the event
        var exportSettings = {
        type: 'png',
        options: event
        };

        // Set up a pool of PhantomJS workers
        exporter.initPool({maxWorkers: 2});

        // Perform an export
        exporter.export(exportSettings, function (err, res) {
            
            // Kill the pool when we're done with it
            exporter.killPool();

            // If everything goes well return the image as base64 otherwise throw error
            if (res) {
                resolve(res, 200);
            } else {
                reject(err);
            }

        });
    })

    // Return the results of the image
    return promise;

};
