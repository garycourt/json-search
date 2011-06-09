/**
 * @constructor
 * @implements {Analyzer}
 */

function StandardAnalyzer() {
	this.analyzer = new StopFilter(new LowerCaseFilter(new StandardTokenizer()), StandardAnalyzer.ENGLISH_STOP_WORDS);
};

/**
 * @const
 * @type {Object.<boolean>}
 */

StandardAnalyzer.ENGLISH_STOP_WORDS = StopFilter.toHash(["a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "if", "in", "into", "is", "it", "no", "not", "of", "on", "or", "such", "that", "the", "their", "then", "there", "these", "they", "this", "to", "was", "will", "with"]);

/**
 * @type {Analyzer}
 */

StandardAnalyzer.prototype.analyzer;

/**
 * @param {FieldName} field
 * @param {string} value
 * @return {Array.<Token>}
 */

StandardAnalyzer.prototype.tokenize = function (field, value) {
	return this.analyzer.tokenize(field, value);
};


exports.StandardAnalyzer = StandardAnalyzer;