/**
 * @constructor
 * @param {string} fld
 * @param {string} [txt]
 */

var Term = function (fld, txt) {
	this.field = fld || "";
	this.text = txt || "";
};

/**
 * @type {string}
 */

Term.prototype.field;

/**
 * @type {string}
 */

Term.prototype.text;

/**
 * @param {string} text
 * @return {Term} 
 */

Term.prototype.createTerm = function (text) {
	return new Term(this.field, text);
};

/**
 * @param {*} obj
 * @return {boolean}
 */

Term.prototype.equals = function (obj) {
	return (this === obj) || (typeof obj === "object" && this.field === obj.field && this.text === obj.text);
};


exports.Term = Term;