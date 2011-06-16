/**
 * @constructor
 * @implements {Query}
 * @param {FieldName} [field]
 * @param {Array.<Token>} [tokens]
 * @param {number} [slop]
 * @param {number} [boost]
 */

function PhraseQuery(field, tokens, slop, boost) {
	this.field = field || null;
	this.tokens = tokens || [];
	this.slop = slop || 0;
	this.boost = boost || 1.0;
};

/**
 * @type {FieldName}
 */

PhraseQuery.prototype.field = null;

/**
 * @type {Array.<Token>}
 */

PhraseQuery.prototype.tokens;

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
	
	for (x = 0, xl = this.tokens.length; x < xl; ++x) {
		terms[terms.length] = this.tokens[x].value;
	}
	
	(new MultiTermQuery(this.field, terms, true, this.boost)).score(similarity, index).pipe(stream);
	return stream;
};

/**
 * @return {Array.<TermVector>}
 */

PhraseQuery.prototype.extractTerms = function () {
	var x, xl, terms = [];
	for (x = 0, xl = this.tokens.length; x < xl; ++x) {
		terms.push(/** @type {TermVector} */ ({
			term : this.tokens[x].value,
			field : this.field
		}));
	}
	return terms;
};

/**
 * @return {Query}
 */

PhraseQuery.prototype.rewrite = function () {
	if (this.tokens.length === 1) {
		return new TermQuery(this.field, this.tokens[0].value, this.boost);
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
		phrase = this._query.tokens,
		slop = this._query.slop,
		termVecs = doc.terms, 
		termPositions = {},
		firstTermPositions,
		position,
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
	firstTermPositions = termPositions[phrase[0].value];
	
	//for each position of the first term
	for (x = 0, xl = firstTermPositions.length; x < xl; ++x) {
		position = 0;
		//for each other term
		for (y = 1, yl = phrase.length; y < yl; ++y) {
			position += phrase[y].positionIncrement;
			minOffset = firstTermPositions[x] + position - slop;
			maxOffset = firstTermPositions[x] + position + slop;
			sibPositions = termPositions[phrase[y].value];
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
		//if the above loop completed without breaking, we found a doc that matches the phrase
		if (y >= yl) {
			this.emit(doc);
			break;
		}
	}
};


exports.PhraseQuery = PhraseQuery;