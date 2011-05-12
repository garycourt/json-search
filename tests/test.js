/**
 * Index
 */

var index = new MemoryIndex();

index.addDocument({
	title : "Test 1",
	body : "This document is the first test object in the index."
}, "test1");

index.addDocument({
	title : "Test 2",
	body : "This document is the second object in the index."
}, "test2");

/**
 * Searcher
 */

var searcher = new Searcher(index);

function testTermSearch(term, field) {
	searcher.search(new TermQuery(term, field), 10, function (err, docs) {
		if (!err) {
			console.log(docs);
		} else {
			console.error(err);
		}
	});
}

function testBooleanSearch(clauses) {
	console.profile();
	searcher.search(new BooleanQuery(clauses), 10, function (err, docs) {
		if (!err) {
			console.log(docs);
		} else {
			console.error(err);
		}
		console.profileEnd();
	});
}

function termQueryBooleanClause(term, field, occur) {
	return new BooleanClause(new TermQuery(term, field), occur);
}

/**
 * Example Searches
 */

//testTermSearch("test", "body");

testBooleanSearch([
	termQueryBooleanClause("document", "body", Occur.MUST), 
	termQueryBooleanClause("second", "body", Occur.MUST_NOT)
]);