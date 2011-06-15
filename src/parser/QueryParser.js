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
 * @type {Analyzer}
 */

QueryParser.defaultAnalyzer = new StandardAnalyzer();

/**
 * @param {string} str
 * @param {string|null} [defaultField]
 * @param {Analyzer} [analyzer]
 * @return {Query}
 * @throws {SyntaxError}
 */

QueryParser.parse = function (str, defaultField, analyzer) {
	var query, oldQuery;
	
	//extract query from query string
	query = QueryParser.impl.parse(str, undefined, defaultField || null, analyzer || QueryParser.defaultAnalyzer);
	
	//optimize query
	do {
		oldQuery = query;
		query = query.rewrite();
	} while (query !== oldQuery);
	
	return query;
};