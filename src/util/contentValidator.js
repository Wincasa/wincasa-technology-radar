import { each } from 'lodash-es';

import { MalformedDataError } from '../exceptions/malformedDataError';
import { ExceptionMessages } from './exceptionMessages';

export function ContentValidator(columnNames) {
    var self = {};
    columnNames = columnNames.map(function(columnName) {
        return columnName.trim();
    });

    self.verifyContent = function() {
        if(columnNames.length == 0){
            throw new MalformedDataError(ExceptionMessages.MISSING_CONTENT);
        }
    };

    self.verifyHeaders = function() {
        each(['name', 'ring', 'quadrant', 'isNew', 'description'], function (field) {
            if (columnNames.indexOf(field) == -1) {
                throw new MalformedDataError(ExceptionMessages.MISSING_HEADERS);
            }
        });
    };

    return self;
}