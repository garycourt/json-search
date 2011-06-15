/**
 * @interface
 */

function Analyzer() {};

/**
 * @param {string} value
 * @param {FieldName} [field]
 * @return {Array.<Token>}
 */

Analyzer.prototype.parse = function (value, field) {};
