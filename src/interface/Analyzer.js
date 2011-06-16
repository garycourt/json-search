/**
 * @interface
 */

function Analyzer() {};

/**
 * @param {Term} value
 * @param {FieldName} [field]
 * @return {Array.<Token>}
 */

Analyzer.prototype.parse = function (value, field) {};
