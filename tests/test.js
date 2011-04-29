function testSearch() {
	var searcher = new Searcher(new MemoryIndex());
	searcher.search(new TermQuery("test", null), 10, function (err, docs) {
		if (!err) {
			console.log(docs);
		} else {
			console.error(err);
		}
	});
}

testSearch();