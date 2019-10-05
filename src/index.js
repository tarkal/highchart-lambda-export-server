// Include the exporter module
const exporter = require('highcharts-export-server');

exports.handler = async (event) => {

    console.log(event);

    const promise = new Promise(function(resolve, reject) {

        // Build the chart options
        var chartOptions = {
        title: {
            text: 'My Chart'
        },
        xAxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "Mar", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        },
        series: [
            {
                type: 'line',
                data: [1, 3, 2, 4]
            },
            {
                type: 'line',
                data: [5, 3, 4, 2]
            }
        ]
        };

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

