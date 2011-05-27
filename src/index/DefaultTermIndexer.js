/**
 * @constructor
 * @implements {TermIndexer}
 */

function DefaultTermIndexer() {};

/**
 * @param {Object} doc
 * @param {FieldName} [field]
 * @return {Array.<TermVector>}
 */

DefaultTermIndexer.prototype.index = function (doc, id, field) {
	var terms,
		entries,
		key,
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
		terms = doc.replace(/[^\w\d]/g, " ").replace(/\s\s/g, " ").toLowerCase().split(" ");
		entries = {};
		
		for (key = 0; key < terms.length; ++key) {
			if (!entries[terms[key]]) {
				entries[terms[key]] = /** @type {TermVector} */ ({
					term : terms[key],
					termFrequency : 1,
					termPositions : [key],
					//termOffsets : [key],  //FIXME
					field : field,
					totalFieldTokens : terms.length,
					documentID : id
				});
			} else {
				//TODO: Optimize
				entries[terms[key]].termFrequency++;
				entries[terms[key]].termPositions.push(key);
				//entries[terms[key]].termOffsets.push(key);  //FIXME
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

DefaultTermIndexer.prototype.toSource = function () {
	//TODO
};


exports.DefaultTermIndexer = DefaultTermIndexer;