var index = new MemoryIndex();
index.addDocument({
	title : "Test 1",
	body : "This document is the first test object in the index."
}, "test1");
index.addDocument({
	title : "Test 2",
	body : "This document is the second object in the index."
}, "test2");

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

testTermSearch("test", "body");


searcher.search(new BooleanQuery([new BooleanClause(new TermQuery("document", "body"), Occur.MUST), new BooleanClause(new TermQuery("second", "body"), Occur.MUST_NOT)]), 10, function (err, docs) {
	if (!err) {
		console.log(docs);
	} else {
		console.error(err);
	}
});