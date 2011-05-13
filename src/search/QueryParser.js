/**
 * @constructor
 */

function QueryParser() {}

/**
 * Provided by the automatically generated QueryParserImpl.js
 * @type {Object}
 */

QueryParser.impl;

/**
 * @param {string} str
 * @param {string|null} [defaultField]
 * @return {Query}
 */

QueryParser.parse = function (str, defaultField) {
	var query, oldQuery;
	
	//extract query from query string
	query = QueryParser.impl.parse(str, undefined, defaultField || null);
	
	//optimize query
	do {
		oldQuery = query;
		query = query.rewrite();
	} while (query !== oldQuery);
	
	return query;
};