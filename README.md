# Highchart Lambda Export Server

This repo was created in response to [this](https://stackoverflow.com/questions/57097890/highcharts-export-server-on-aws-lamdba/57158024) question on stackoverflow.


Deploying a highcharts export server on AWS Lambda turned out to be **WAY** more difficult than anticipated due to the lack of available information and the large amount of trial and error. So hopefully this will help save you days of pain!

If you are in a hurry you you can just download and use the prebuilt zip straight out of the box as a lambda deployment. You will need a Lambda function running `Node.js 10.x`. 


You will need to set the `FONTCONFIG_PATH` Lambda Environment variable to `/var/task/lib`.

[![FONTCONFIG_PATH][1]][1]

The function expects a JSON representation of the chart options.

```json
{
  "title": {
    "text": "My Chart"
  },
  "xAxis": {
    "categories": [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mar",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ]
  },
  "series": [
    {
      "type": "line",
      "data": [
        1,
        3,
        2,
        4
      ]
    },
    {
      "type": "line",
      "data": [
        5,
        3,
        4,
        2
      ]
    }
  ]
}
```

And it will return a Base64 encoded PNG of the chart in a `data` object.

```json
{
  "data": "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"
}
```


# Building from scratch:

A fairly significant proportion of the packages needed for this need to be compiled specifically for the OS so the only way I found to achieve this universally was by using docker with an AWS image that matches the one used by Lambda.

```bash
// Launch the docker with amazon linux
docker run -it --rm amazonlinux:2.0.20190508

// Install nodejs
curl --silent --location https://rpm.nodesource.com/setup_10.x | bash -
yum -y install nodejs

// Install required dependencies
yum install -y bzip2 tar
yum install -y yum-utils rpmdevtools
cd /tmp
yumdownloader fontconfig.x86_64 freetype.x86_64 expat.x86_64
rpmdev-extract *.rpm

// Install wget and download the ttf fonts
yum install wget
wget https://github.com/tarkal/highchart-lambda-export-server/raw/master/fonts.zip

// Create the project and a folder called lib inside it
mkdir -p /highchart_export_server/lib

// Copy the installed dependencies to the lib folder
cp /tmp/*/usr/lib64/* /highchart_export_server/lib
cp /tmp/*/etc/fonts/fonts.conf /highchart_export_server/lib

// Unzip the fonts into the lib
unzip -j fonts.zip -d /highchart_export_server/lib

// Download the custom font.conf to replace the existing one
wget https://raw.githubusercontent.com/tarkal/highchart-lambda-export-server/master/font.conf -P /highchart_export_server/lib

// Init the project and install highcharts-export-server
cd /highchart_export_server
npm install highcharts-export-server

// For some reason the install shows some warnings that can be fixed by an audit
// To run an audit the system needs a package.json created with the init
npm init
npm audit fix

// Download the basic index.js
wget https://raw.githubusercontent.com/tarkal/highchart-lambda-export-server/master/index.js

// Zip everything up into a deployment package
// The -y and -r options are needed to include all files and embed sim links
// You must not include the parent directory
zip -y -r highcharts-export-server.zip .
```

Now you need to copy the zip file from the docker container onto your host machine. Open a new terminal window and type the following:

```bash
// Show all the docker containers
docker ps

// This will show you some info including the container ID that you need
 
// Copy the file to the host
docker cp <container_id_returned_from_docker_ps>:/highchart_export_server/highcharts-export-server.zip highcharts-export-server.zip
```

So at this point you end up with a zip file containing the following;

[![zip][2]][2]

This is the same package as provided in the above pre-build zip. You can now unpack that on any OS and edit the `index.js` file to suite your needs.

The most important parts to note about the `index.js` are;

1. You MUST run everything inside a `Promise`. Otherwise the highcharts server will return an `undefined` `res` in the export function and you will end up with an error every time.
2. You need to include the `{maxWorkers: 2}` in the init. For some unknown reason it fails on lambda without it (likely a resource issue).
3. Lambda functions cannot return files directly. So if you are going to convert your chart to a PDF or SVG you will need to create some code to handle writing the file that is created by highcharts to a byte[] (or some other mechanism like S3) 

I hope this helps.

> **JS Experts** If someone wants to submit some code for a better `index.js` feel free. 

> **Highcharts Team**: Feel free to use this in your docs and/or link to it to help your users.

> **Download Prebuilt Zip:** [lambda-highcharts-export-server.zip][3]


  [1]: https://i.stack.imgur.com/KVf4o.jpg
  [2]: https://i.stack.imgur.com/U0AMl.jpg
  [3]: https://predictivetech.io/public/projects/highcharts/highcharts-export-server.zip
