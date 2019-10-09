// Include the exporter module
const exporter = require('highcharts-export-server');

exports.handler = async (event) => {

    console.log(event);

    const promise = new Promise(function(resolve, reject) {

        // Export settings
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

