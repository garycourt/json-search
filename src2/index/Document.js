/**
 * @constructor
 * @param {DocumentID} [id]
 * @param {Object} [json]
 * @param {number} [boost]
 */

function Document(id, json, boost) {
	this.id = id || null;
	this.boost = boost;
	if (json) {
		this.parseJSON(json);
	}
};

/**
 * @type {DocumentID}
 */

Document.prototype.id;

/**
 * @type {number}
 */

Document.prototype.boost = 1.0;

/**
 * @param {Object} json
 */

Document.prototype.parseJSON = function (json) {
	//TODO
};

/**
 * @param {string} name
 * @param {null|boolean|number|string} value
 * @param {boolean} [analyze]
 * @param {number} [boost]
 */

Document.prototype.addField = function (name, value, analyze, boost) {
	//TODO
};