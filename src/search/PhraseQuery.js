/**
 * @constructor
 * @implements {Query}
 * @param {FieldName} [field]
 * @param {Array.<Term|undefined>} [terms]
 * @param {number} [slop]
 * @param {number} [boost]
 */

function PhraseQuery(field, terms, slop, boost) {
	this.field = field || null;
	this.terms = terms || [];
	this.slop = slop || 0;
	this.boost = boost || 1.0;
};

/**
 * @param {FieldName} [field]
 * @param {Array.<Token>} [tokens]
 * @param {number} [slop]
 * @param {number} [boost]
 * @return {PhraseQuery}
 */

PhraseQuery.createFromTokens = function (field, tokens, slop, boost) {
	var x, xl, p, terms = [];
	tokens = tokens || [];
	
	for (x = 0, xl = tokens.length, p = -1; x < xl; ++x) {
		p += tokens[x].positionIncrement;
		terms[p] = tokens[x].value;
	}
	
	return new PhraseQuery(field, terms, slop, boost);
};

/**
 * @type {FieldName}
 */

PhraseQuery.prototype.field = null;

/**
 * @type {Array.<Term|undefined>}
 */

PhraseQuery.prototype.terms;

/**
 * @type {number}
 */

PhraseQuery.prototype.slop = 0;

/**
 * @type {number}
 */

PhraseQuery.prototype.boost = 1.0;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {Stream}
 */

PhraseQuery.prototype.score = function (similarity, index) {
	var stream = new PhraseFilter(this),
		x, xl, terms = [];
	
	for (x = 0, xl = this.terms.length; x < xl; ++x) {
		if (typeof this.terms[x] !== "undefined") {
			terms[terms.length] = this.terms[x];
		}
	}
	
	(new MultiTermQuery(this.field, terms, true, this.boost)).score(similarity, index).pipe(stream);
	return stream;
};

/**
 * @return {Array.<TermVector>}
 */

PhraseQuery.prototype.extractTerms = function () {
	var x, xl, terms = [];
	for (x = 0, xl = this.terms.length; x < xl; ++x) {
		if (typeof this.terms[x] !== "undefined") {
			terms.push(/** @type {TermVector} */ ({
				term : this.terms[x],
				field : this.field
			}));
		}
	}
	return terms;
};

/**
 * @return {Query}
 */

PhraseQuery.prototype.rewrite = function () {
	//TODO: Remove useless undefineds from start/end of array
	
	if (this.terms.length === 1 && typeof this.terms[0] !== "undefined") {
		return new TermQuery(this.field, /** @type {string} */ (this.terms[0]), this.boost);
	}
	//else
	return this;
};


/**
 * @protected
 * @constructor
 * @extends {Stream}
 * @param {PhraseQuery} query
 */

function PhraseFilter(query) {
	Stream.call(this);
	this._query = query;
};

PhraseFilter.prototype = Object.create(Stream.prototype);

/**
 * @protected
 * @type {PhraseQuery}
 */

PhraseFilter.prototype._query;

/**
 * @param {DocumentTerms} doc
 */

PhraseFilter.prototype.onWrite = function (doc) {
	var x, xl, y, yl, z, zl,
		phrase = this._query.terms,
		slop = this._query.slop,
		termVecs = doc.terms, 
		termPositions = {},
		positions,
		minOffset,
		maxOffset,
		sibPositions;
	
	//create hash of term positions
	for (x = 0, xl = termVecs.length; x < xl; ++x) {
		if (!(termPositions[termVecs[x].term] = termVecs[x].termPositions)) {
			//no term position information available, just fail
			return;
		}
	}
	
	//use the first term in the phrase as the offset to compare to
	positions = termPositions[phrase[0]];
	
	//for each position of the first term
	for (x = 0, xl = positions.length; x < xl; ++x) {
		//for each other term
		for (y = 1, yl = phrase.length; y < yl; ++y) {
			if (typeof phrase[y] !== "undefined") {
				minOffset = positions[x] + y - slop;
				maxOffset = positions[x] + y + slop;
				sibPositions = termPositions[phrase[y]];
				//for each position of the other term
				for (z = 0, zl = sibPositions.length; z < zl; ++z) {
					//if the position of the other term is within the sloppy offset, we have a match
					if (sibPositions[z] >= minOffset && sibPositions[z] <= maxOffset) {
						break;
					}
				}
				//if the above loop completed without breaking, the term was not within the offset
				if (z >= zl) {
					break;
				}
			}
		}
		//if the above loop completed without breaking, we found a doc that matches the phrase
		if (y >= yl) {
			this.emit(doc);
			break;
		}
	}
};


exports.PhraseQuery = PhraseQuery;