/**
 * @constructor
 * @implements {Indexer}
 */

function DefaultIndexer() {
	this.analyzer = new StandardAnalyzer();
};

/**
 * @param {Object} doc
 * @param {DocumentID} id
 * @param {FieldName} [field]
 * @return {Array.<TermVector>}
 */

DefaultIndexer.prototype.index = function (doc, id, field) {
	var tokens,
		entries,
		key,
		tokenValue,
		position = 0,
		/** @type {Array.<TermVector>} */
		result = [];
	
	switch (typeOf(doc)) {
	case 'null':
	case 'boolean':
	case 'number':
		result[0] = /** @type {TermVector} */ ({
				term : doc,
				field : field || null,
				documentID : id
		});
		break;
		
	case 'string':
		tokens = this.analyzer.tokenize(/** @type {string} */ (doc));
		entries = {};
		
		for (key = 0; key < tokens.length; ++key) {
			tokenValue = tokens[key].value;
			position += tokens[key].positionIncrement;
			if (!entries[tokenValue]) {
				entries[tokenValue] = /** @type {TermVector} */ ({
					term : tokenValue,
					termFrequency : 1,
					termPositions : [ position ],
					termOffsets : [ tokens[key].startOffset ],
					field : field,
					totalFieldTokens : tokens.length,
					documentID : id
				});
			} else {
				//TODO: Optimize
				entries[tokenValue].termFrequency++;
				entries[tokenValue].termPositions.push(position);
				entries[tokenValue].termOffsets.push(tokens[key].startOffset);
			}
		}
		
		for (key in entries) {
			if (entries[key] !== O[key]) {
				result[result.length] = entries[key];
			}
		}
		break;
		
	case 'object':
		for (key in doc) {
			if (doc[key] !== O[key]) {
				result = result.concat(this.index(doc[key], id, (field ? field + "." + key : key)));
			}
		}
		break;
	
	case 'array':
		for (key = 0; key < doc.length; ++key) {
			result = result.concat(this.index(doc[key], id, (field ? field + "." + key : String(key))));
		}
		break;
	}
	
	return result;
};

/**
 * @return {string}
 */

DefaultIndexer.prototype.toSource = function () {
	//TODO
};


exports.DefaultIndexer = DefaultIndexer;