A library that generates an interactive radar, inspired by [thoughtworks.com/radar](http://thoughtworks.com/radar).

## Demo

You can see this in action at https://wincasatechradar.z6.web.core.windows.net/.

## How To Use

The easiest way to use the app is to fill out the spreadsheet with your own data

### Setting up your data

### Using CSV data
The currently only way to provide your data is using CSV document format.
You should fill in the `spreadsheet.csv` file in the `src/csv` folder
The format is as follows:

```
name,ring,quadrant,isNew,description  
Composer,adopt,tools,TRUE,"Although the idea of dependency management ..."  
Canary builds,trial,techniques,FALSE,"Many projects have external code dependencies ..."  
Apache Kylin,assess,platforms,TRUE,"Apache Kylin is an open source analytics solution ..."  
JSF,hold,languages & frameworks,FALSE,"We continue to see teams run into trouble using JSF ..."  
```

Note: The CSV file parsing is using D3 library, so consult the D3 documentation for the data format details.

That's it!

Note: the quadrants of the radar, and the order of the rings inside the radar will be drawn in the order they appear in your data.

### More complex usage

To create the data representation, you can use the CSV, or you can also insert all your data straight into the code.

The app uses [D3.js](https://d3js.org/) if supplied as CSV, so refer to their documentation for more advanced interaction.

The application uses [webpack](https://webpack.github.io/) to package dependencies and minify all .js and .scss files.

## Contribute

All tasks are defined in `package.json`.

Pull requests are welcome; please write tests whenever possible. 
Make sure you have nodejs installed.

- `git clone https://github.com/Wincasa/wincasa-technology-radar.git`
- `npm install`
- `npm test` - to run your tests (they will not work at the moment)
- `npm start` - to run application in localhost:8080. This will watch the .js and .css files and rebuild on file changes

### Don't want to install node? Run with one line docker (don't know if this works)

     $ docker run -p 8080:8080 -v $PWD:/app -w /app -it node:7.3.0 /bin/sh -c 'npm install && npm start'

After building it will start on localhost:8080

This repo was forked from https://github.com/thoughtworks/build-your-own-radar.