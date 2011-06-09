/**
 * @constructor
 * @implements {Analyzer}
 * @param {Analyzer} analyzer
 * @param {function(Token): boolean} [filterer]
 * @param {function(Token): Token} [mapper]
 */

function BaseFilter(analyzer, filterer, mapper) {
	this.analyzer = analyzer;
	this.filterer = filterer;
	this.mapper = mapper;
};

/**
 * @type {Analyzer}
 */

BaseFilter.prototype.analyzer;

/**
 * @type {(function(Token): boolean)|undefined}
 */

BaseFilter.prototype.filterer;

/**
 * @type {(function(Token): Token)|undefined}
 */

BaseFilter.prototype.mapper;

/**
 * @param {string} value
 * @return {Array.<Token>}
 */

BaseFilter.prototype.tokenize = function (value) {
	var tokens = this.analyzer.tokenize(value),
		x, xl, result, skipped = 0;
		
	if (this.filterer) {
		result = [];
		for (x = 0, xl = tokens.length; x < xl; ++x) {
			if (this.filterer(tokens[x])) {
				tokens[x].positionIncrement += skipped;
				result[result.length] = tokens[x];
				skipped = 0;
			} else {
				skipped += tokens[x].positionIncrement;
			}
		}
	} else {
		result = tokens;
	}
	
	if (this.mapper) {
		result = result.map(this.mapper);
	}
	
	return result;
};


exports.BaseFilter = BaseFilter;