/**
 * @interface
 */

function Index() {};

/**
 * @param {string} term
 * @param {string|null} field
 * @param {InputStream} output
 */

Index.prototype.getTermDocuments = function (term, field, output) {};