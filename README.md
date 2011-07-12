# JSON Search

JSON Search is an asynchronous full text indexing and searching library written in JavaScript, and is based off Lucene.

JSON Search is still a work in progress, but is currently fully functional and supports almost all of the core features of Lucene.
It is sorely lacking documentation and unit tests, but you can get a good sense of what it can do by looking at the files in the `src` directory.

## Example

Here's a quick example on how to use JSON Search:

	var js = require('./json-search');
	var index = new js.MemoryIndex();
	
	index.addDocument({
		title : "JavaScript",
		body : "JavaScript, also known as ECMAScript, is a prototype-based, object-oriented scripting language that is dynamic, weakly typed and has first-class functions.",
		edits : 0
	}, "javascript");
	//
	//add other documents here
	
	var searcher = new js.Searcher(index);
	var query = js.QueryParser.parse("+body:dynamic -body:compiled");
	searcher.search(query, 10, function (err, docs) {
		if (!err) {
			console.log(docs);
		} else {
			console.error(err);
		}
	});

## TODO

*	Better intro/documentation
*	Write unit tests
*	Document source code
*	Add different storage indexes
*	Add stemmers from jsSnowball
*	Add language detection
*	Improve UTF-8 support in parsers/tokenizers

## License

Copyright 2011 Gary Court. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are
permitted provided that the following conditions are met:

1.	Redistributions of source code must retain the above copyright notice, this list of
	conditions and the following disclaimer.

2.	Redistributions in binary form must reproduce the above copyright notice, this list
	of conditions and the following disclaimer in the documentation and/or other materials
	provided with the distribution.

THIS SOFTWARE IS PROVIDED BY GARY COURT ``AS IS'' AND ANY EXPRESS OR IMPLIED
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL GARY COURT OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.