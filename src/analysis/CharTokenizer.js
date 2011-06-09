/**
 * @constructor
 * @implements {Analyzer}
 * @param {RegExp} regexp
 */

function CharTokenizer(regexp) {
	this.regexp = regexp;
};

/**
 * @type {RegExp}
 */

CharTokenizer.prototype.regexp;

/**
 * @param {string} value
 * @return {Array.<Token>}
 */

CharTokenizer.prototype.tokenize = function (value) {
	var x, xl, 
		regexp = this.regexp, 
		word = "", 
		startOffset = 0, 
		result = [];
	
	for (x = 0, xl = value.length; x < xl; ++x) {
		if (regexp.test(value[x])) {
			word += value[x];
		} else {
			if (word.length) {
				result[result.length] = /** @type {Token} */ ({
					type : "word",
					value : word,
					startOffset : startOffset,
					endOffset : x,
					positionIncrement : 1
				});
				word = "";
			}
			startOffset = x + 1;
		}
	}
	
	if (word.length) {
		result[result.length] = /** @type {Token} */ ({
			type : "word",
			value : word,
			startOffset : startOffset,
			endOffset : value.length,
			positionIncrement : 1
		});
	}
	
	return result;
};


/**
 * @constructor
 * @extends {CharTokenizer}
 * @implements {Analyzer}
 */

function WhitespaceTokenizer() {};
WhitespaceTokenizer.prototype = Object.create(CharTokenizer.prototype);
WhitespaceTokenizer.prototype.regexp = /[^\u0009-\u000D\u001C-\u001F\u0020\u0085\u1680\u180E\u2000-\u2006\u2008-\u200A\u2028\u2029\u205F\u3000]/;


/**
 * @constructor
 * @extends {CharTokenizer}
 * @implements {Analyzer}
 */

function LetterTokenizer() {};
LetterTokenizer.prototype = Object.create(CharTokenizer.prototype);
LetterTokenizer.prototype.regexp = /[A-Za-z]/;  //TODO: Make this Unicode compliant


exports.CharTokenizer = CharTokenizer;
exports.WhitespaceTokenizer = WhitespaceTokenizer;
exports.LetterTokenizer = LetterTokenizer;