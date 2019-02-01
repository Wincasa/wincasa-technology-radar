import { map, uniqBy, each, capitalize } from 'lodash-es';
import { selectAll, csv, select } from 'd3';
import { Radar } from '../models/radar';
import { Quadrant } from '../models/quadrant';
import { Ring } from '../models/ring';
import { Blip } from '../models/blip';
import { Radar as GraphingRadar } from '../graphing/radar';
import { MalformedDataError } from '../exceptions/malformedDataError';
import { ContentValidator } from './contentValidator';
import { ExceptionMessages } from './exceptionMessages';
import spreadsheet from '../csv/spreadsheet.csv';

const radarName = 'Wincasa Technology Radar February 2019';

const plotRadar = function (title, blips) {
    document.title = title;
    selectAll('.loading').remove();

    var rings = map(uniqBy(blips, 'ring'), 'ring');
    var ringMap = {};
    var maxRings = 4;

    each(rings, function (ringName, i) {
        if (i == maxRings) {
            throw new MalformedDataError(ExceptionMessages.TOO_MANY_RINGS);
        }
        ringMap[ringName] = new Ring(ringName, i);
    });

    var quadrants = {};
    each(blips, function (blip) {
        if (!quadrants[blip.quadrant]) {
            quadrants[blip.quadrant] = new Quadrant(capitalize(blip.quadrant));
        }
        quadrants[blip.quadrant].add(new Blip(blip.name, ringMap[blip.ring], blip.isNew.toLowerCase() === 'true', blip.topic, blip.description));
    });

    var radar = new Radar();
    each(quadrants, function (quadrant) {
        radar.addQuadrant(quadrant);
    });

    var size = (window.innerHeight - 133) < 620 ? 620 : window.innerHeight - 133;

    new GraphingRadar(size, radar).init().plot();
};

const CSVDocument = function (url) {
    var self = {};

    self.build = function () {
        csv(url, createBlips);
    };

    var createBlips = function (data) {
        try {
            var columnNames = data['columns'];
            delete data['columns'];
            var contentValidator = new ContentValidator(columnNames);
            contentValidator.verifyContent();
            contentValidator.verifyHeaders();
            plotRadar(radarName, data);
        } catch (exception) {
            plotErrorMessage(exception);
        }
    };

    self.init = function () {
        plotLoading();
        return self;
    };

    return self;
};

export function GoogleSheetInput() {
    var self = {};
    
    self.build = function () {
        var sheet = CSVDocument(spreadsheet);

        sheet.init().build();
    };

    return self;
}

function set_document_title() {
    document.title = 'Build your own Radar';
}

function plotLoading() {
    var content = select('body')
        .append('div')
        .attr('class', 'loading')
        .append('div')
        .attr('class', 'input-sheet');

    set_document_title();

    var bannerText = '<h1>Building your radar...</h1><p>Your Technology Radar will be available in just a few seconds</p>';
    plotBanner(content, bannerText);
    plotFooter(content);
}

function plotFooter(content) {
    content
        .append('div')
        .attr('id', 'footer')
        .append('div')
        .attr('class', 'footer-content')
        .append('p')
        .html('This software can be found on <a href="https://github.com/Wincasa/wincasa-technology-radar">github</a> and is available for download and self-hosting.');
}

function plotBanner(content, text) {
    content.append('div')
        .attr('class', 'input-sheet__banner')
        .html(text);

}

function plotErrorMessage(exception) {
    selectAll('.loading').remove();
    var message = 'Oops! It seems like there are some problems with loading your data. ';

    if (exception instanceof MalformedDataError) {
        message = message.concat(exception.message);
    } else {
        console.error(exception);
    }

    message = message.concat('<br/>', 'Please check <a href="https://www.thoughtworks.com/radar/how-to-byor">FAQs</a> for possible solutions.');

    select('body')
        .append('div')
        .attr('class', 'error-container')
        .append('div')
        .attr('class', 'error-container__message')
        .append('p')
        .html(message);
}