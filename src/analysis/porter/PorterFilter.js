/**
 * Transforms the token stream as per the Porter stemming algorithm.
 * 
 * Note: the input to the stemming filter must already be in lower case,
 * so you will need to use LowerCaseFilter farther down the Tokenizer 
 * chain in order for this to work properly!
 * 
 * @constructor
 * @implements {Analyzer}
 * @param {Analyzer} analyzer
 */

function PorterFilter(analyzer) {
	this.analyzer = analyzer;
};

/**
 * @type {Analyzer}
 */

PorterFilter.prototype.analyzer;

/**
 * @param {Term} value
 * @param {FieldName} [field]
 * @return {Array.<Token>}
 */

PorterFilter.prototype.parse = function (value, field) {
	var x, xl, 
		result = [],
		tokens = this.analyzer.parse(value, field),
		stemmed;
	
	for (x = 0, xl = tokens.length; x < xl; ++x) {
		result[result.length] = tokens[x];
		if (typeof tokens[x].value === "string") {
			stemmed = porterStem(tokens[x].value);
			if (stemmed !== tokens[x].value) {
				result[result.length] = /** @type {Token} */ ({
					value : stemmed,
					startOffset : tokens[x].startOffset,
					endOffset : tokens[x].endOffset,
					positionIncrement : 0
				});
			}
		}
	}
	
	return result;
};


exports.PorterFilter = PorterFilter;