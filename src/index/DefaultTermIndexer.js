/**
 * @constructor
 * @implements {TermIndexer}
 */

function DefaultTermIndexer() {};

/**
 * @param {Object} doc
 * @param {string} [field]
 * @return {Array.<TermVectorEntry>}
 */

DefaultTermIndexer.prototype.index = function (doc, id, field) {
	var terms,
		entries,
		key,
		/** @type {Array.<TermVectorEntry>} */
		result = [];
	
	switch (typeOf(doc)) {
	case 'null':
	case 'boolean':
	case 'number':
		result[0] = /** @type {TermVectorEntry} */ ({
				term : doc,
				field : field,
				documentID : id
		});
		break;
		
	case 'string':
		terms = doc.replace(/[^\w\d]/g, " ").replace(/\s\s/g, " ").toLowerCase().split(" ");
		entries = {};
		
		for (key = 0; key < terms.length; ++key) {
			if (!entries[terms[key]]) {
				entries[terms[key]] = /** @type {TermVectorEntry} */ ({
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
 * @param {TermVectorEntry} a
 * @param {TermVectorEntry} b
 * @return {number}
 */

DefaultTermIndexer.prototype.compareDocumentIds = function (a, b) {
	if (a.documentID < b.documentID) {
		return -1;
	} else if (a.documentID > b.documentID) {
		return 1;
	} 
	//else
	return 0;
};

/**
 * @param {TermVectorEntry} entry
 * @return {TermVector}
 */

DefaultTermIndexer.prototype.toTermVector = function (entry) {
	return /** @type {TermVector} */ ({
		term : entry.term,
		termFrequency : entry.termFrequency || 1,
		termPositions : entry.termPositions || null,
		termOffsets : entry.termOffsets || null,
		field : entry.field || null,
		fieldBoost : entry.fieldBoost || 1.0,
		totalFieldTokens : entry.totalFieldTokens || 1,
		documentBoost : entry.fieldBoost || 1.0,
		documentID : entry.documentID,
		documentFrequency : 1,
		totalDocuments : 1
	});
};

/**
 * @return {String}
 */

DefaultTermIndexer.prototype.toSource = function () {
	//TODO
};


exports.DefaultTermIndexer = DefaultTermIndexer;