/**
 * @constructor
 * @implements {Analyzer}
 * @param {Analyzer} analyzer
 * @param {Object.<boolean>|Array.<string>} stopWords
 */

function StopFilter(analyzer, stopWords) {
	this.analyzer = analyzer;
	if (typeOf(stopWords) === "array") {
		this.stopWords = StopFilter.toHash(/** @type {Array.<string>} */ (stopWords));
	} else {
		this.stopWords = /** @type {Object.<boolean>} */ (stopWords);
	}
};

/**
 * @param {Array.<string>} arr
 * @return {Object.<boolean>}
 */

StopFilter.toHash = function (arr) {
	var x, xl, result = {};
	for (x = 0, xl = arr.length; x < xl; ++x) {
		result[arr[x]] = true;
	}
	return result;
};

/**
 * @type {Analyzer}
 */

StopFilter.prototype.analyzer;

/**
 * @type {Object.<boolean>}
 */

StopFilter.prototype.stopWords;

/**
 * @param {string} value
 * @param {FieldName} [field]
 * @return {Array.<Token>}
 */

StopFilter.prototype.parse = function (value, field) {
	var x, xl, tokenValue,
		tokens = this.analyzer.parse(value, field),
		stopWords = this.stopWords,
		result = [],
		skipped = 0;
	for (x = 0, xl = tokens.length; x < xl; ++x) {
		tokenValue = tokens[x].value;
		if (typeof tokenValue !== "string" || stopWords[tokenValue] !== true) {
			tokens[x].positionIncrement += skipped;
			result[result.length] = tokens[x];
			skipped = 0;
		} else {
			skipped += tokens[x].positionIncrement;
		}
	}
	return result;
};


exports.StopFilter = StopFilter;