/**
 * @constructor
 * @implements {Analyzer}
 */

function StandardTokenizer() {};

//TODO: Make these regular expressions Unicode compliant

/**
 * @const
 */

StandardTokenizer.LETTER = /[A-Za-z]/;

/**
 * @const
 */

StandardTokenizer.SKIP_LETTER = /['&@_]/;

/**
 * @const
 */

StandardTokenizer.DIGIT = /[0-9]/;

/**
 * @const
 */

StandardTokenizer.ALPHANUM = /[0-9A-Za-z]/;

/**
 * @param {Term} value
 * @param {FieldName} [field]
 * @return {Array.<Token>}
 */

StandardTokenizer.prototype.parse = function (value, field) {
	var x, xl, chr, 
		state = StandardTokenizerState.UNKNOWN, 
		startOffset = 0,
		tokenValue = "",
		tokenReady = false,
		result = [];
	
	if (typeof value === "string") {
		for (x = 0, xl = value.length; x <= xl; ++x) {
			chr = value[x];
			
			if (chr !== undefined) {
				switch (state) {
				case StandardTokenizerState.UNKNOWN:
					if (StandardTokenizer.LETTER.test(chr)) {
						state = StandardTokenizerState.STRING;
						startOffset = x;
						tokenValue = chr;
					} else if (StandardTokenizer.DIGIT.test(chr)) {
						state = StandardTokenizerState.INT;
						startOffset = x;
						tokenValue = chr;
					}
					break;
					
				case StandardTokenizerState.STRING:
					if (StandardTokenizer.ALPHANUM.test(chr)) {
						tokenValue += chr;
					} else if (!StandardTokenizer.SKIP_LETTER.test(chr)) {
						tokenReady = true;  //word
					}
					break;
				
				case StandardTokenizerState.INT:
					if (StandardTokenizer.DIGIT.test(chr)) {
						tokenValue += chr;
					} else if (chr === ".") {
						state = StandardTokenizerState.FLOAT;
						tokenValue += chr;
					} else if (StandardTokenizer.LETTER.test(chr)) {
						state = StandardTokenizerState.STRING;
						tokenValue += chr;
					} else {
						tokenReady = true;  //number
						tokenValue = parseInt(tokenValue, 10);
					}
					break;
				
				case StandardTokenizerState.FLOAT:
					if (StandardTokenizer.DIGIT.test(chr)) {
						tokenValue += chr;
					} else if (chr === "." || StandardTokenizer.LETTER.test(chr)) {
						state = StandardTokenizerState.STRING;
						tokenValue += chr;
					} else {
						tokenReady = true;  //number
						tokenValue = parseFloat(tokenValue);
					}
					break;
				}
			} else {  //end of string
				switch (state) {
				case StandardTokenizerState.STRING:
					tokenReady = true; //word
					break;
					
				case StandardTokenizerState.INT:
				case StandardTokenizerState.FLOAT:
					tokenReady = true;  //number
					tokenValue = parseFloat(tokenValue);
					break;
				}
			}
			
			if (tokenReady) {
				result[result.length] = /** @type {Token} */ ({
					value : tokenValue,
					startOffset : startOffset,
					endOffset : x,
					positionIncrement : 1
				});
				
				state = StandardTokenizerState.UNKNOWN
				tokenReady = false;
				--x;  //reprocess character
			}
		}
	} else {
		result = [/** @type {Token} */ ({
			value : value,
			positionIncrement : 1
		})];
	}
	
	return result;
};

/**
 * @const
 * @enum
 */

var StandardTokenizerState = {
	UNKNOWN : 0,
	STRING : 1,
	INT : 2,
	FLOAT : 3
};


exports.StandardTokenizer = StandardTokenizer;