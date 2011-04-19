/**
 * @constructor
 * @implements Index
 */

function MemoryIndex() {};

/**
 * @param {string} term
 * @param {string|null} field
 * @param {InputStream} output
 */

MemoryIndex.prototype.getTermDocuments = function (term, field, output) {
	//TODO
	output.start(null);
	output.end(null);
};