/**
 * Index
 */

//console.profile();

var index = new JSONSearch.MemoryIndex();

index.addDocument({
	title : "JavaScript",
	body : "JavaScript, also known as ECMAScript, is a prototype-based, object-oriented scripting language that is dynamic, weakly typed and has first-class functions. It is also considered a functional programming language like Scheme and OCaml because it has closures and supports higher-order functions.JavaScript is an implementation of the ECMAScript language standard and is primarily used in the form of client-side JavaScript, implemented as part of a web browser in order to provide enhanced user interfaces and dynamic websites. This enables programmatic access to computational objects within a host environment.JavaScript's use in applications outside web pages—for example in PDF documents, site-specific browsers and desktop widgets—is also significant. Newer and faster JavaScript VMs and frameworks built upon them (notably Node.js) have also increased the popularity of JavaScript for server-side web apps.JavaScript uses syntax influenced by that of C. JavaScript copies many names and naming conventions from Java, but the two languages are otherwise unrelated and have very different semantics. The key design principles within JavaScript are taken from the Self and Scheme programming languages.",
	index : 0
}, "javascript");

index.addDocument({
	title : "Java",
	body : "Java is a programming language originally developed by James Gosling at Sun Microsystems (which is now a subsidiary of Oracle Corporation) and released in 1995 as a core component of Sun Microsystems' Java platform. The language derives much of its syntax from C and C++ but has a simpler object model and fewer low-level facilities. Java applications are typically compiled to bytecode (class file) that can run on any Java Virtual Machine (JVM) regardless of computer architecture. Java is a general-purpose, concurrent, class-based, object-oriented language that is specifically designed to have as few implementation dependencies as possible. It is intended to let application developers 'write once, run anywhere'. Java is currently one of the most popular programming languages in use, and is widely used from application software to web applications.The original and reference implementation Java compilers, virtual machines, and class libraries were developed by Sun from 1995. As of May 2007, in compliance with the specifications of the Java Community Process, Sun relicensed most of its Java technologies under the GNU General Public License. Others have also developed alternative implementations of these Sun technologies, such as the GNU Compiler for Java, GNU Classpath, and Dalvik.",
	index : 1
}, "java");

index.addDocument({
	title : "C++",
	body : "C++ (pronounced 'see plus plus') is a statically typed, free-form, multi-paradigm, compiled, general-purpose programming language. It is regarded as an intermediate-level language, as it comprises a combination of both high-level and low-level language features. It was developed by Bjarne Stroustrup starting in 1979 at Bell Labs as an enhancement to the C language and originally named C with Classes. It was renamed C++ in 1983.C++ is one of the most popular programming languages and its application domains include systems software, application software, device drivers, embedded software, high-performance server and client applications, and entertainment software such as video games. Several groups provide both free and proprietary C++ compiler software, including the GNU Project, Microsoft, Intel and Embarcadero Technologies. C++ has greatly influenced many other popular programming languages, most notably C# and Java.C++ is also used for hardware design, where the design is initially described in C++, then analyzed, architecturally constrained, and scheduled to create a register-transfer level hardware description language via high-level synthesis.",
	index : 2
}, "c++");

index.addDocument({
	title : "Ruby",
	body : "Ruby is a dynamic, reflective, general-purpose object-oriented programming language that combines syntax inspired by Perl with Smalltalk-like features. Ruby originated in Japan during the mid-1990s and was first developed and designed by Yukihiro Matsumoto. It was influenced primarily by Perl, Smalltalk, Eiffel, and Lisp.Ruby supports multiple programming paradigms, including functional, object oriented, imperative and reflective. It also has a dynamic type system and automatic memory management; it is therefore similar in varying respects to Python, Perl, Lisp, Dylan, Pike, and CLU.The standard 1.8.7 implementation is written in C, as a single-pass interpreted language. There is currently no specification of the Ruby language, so the original implementation is considered to be the de facto reference. As of 2010, there are a number of complete or upcoming alternative implementations of the Ruby language, including YARV, JRuby, Rubinius, IronRuby, MacRuby, and HotRuby. Each takes a different approach, with IronRuby, JRuby and MacRuby providing just-in-time compilation and MacRuby also providing ahead-of-time compilation. The official 1.9 branch uses YARV, as will 2.0 (development), and will eventually supersede the slower Ruby MRI.",
	index : 3
}, "ruby");

index.addDocument({
	title : "Python",
	body : "Python is an interpreted, general-purpose high-level programming language whose design philosophy emphasizes code readability. Python aims to combine 'remarkable power with very clear syntax', and its standard library is large and comprehensive. Its use of indentation for block delimiters is unique among popular programming languages.Python supports multiple programming paradigms, primarily but not limited to object-oriented, imperative and, to a lesser extent, functional programming styles. It features a fully dynamic type system and automatic memory management, similar to that of Scheme, Ruby, Perl, and Tcl. Like other dynamic languages, Python is often used as a scripting language, but is also used in a wide range of non-scripting contexts.The reference implementation of Python (CPython) is free and open source software and has a community-based development model, as do all or nearly all of its alternative implementations. CPython is managed by the non-profit Python Software Foundation.Python interpreters are available for many operating systems, and Python programs can be packaged into stand-alone executable code for many systems using various tools.",
	index : 4
}, "python");

//console.profileEnd();

/**
 * Searcher
 */

var searcher = new JSONSearch.Searcher(index);

function testTermSearch(field, term) {
	searcher.search(new JSONSearch.TermQuery(field, term), 10, function (err, docs) {
		if (!err) {
			console.log(docs);
		} else {
			console.error(err);
		}
	});
}

function testBooleanSearch(clauses) {
	//console.profile();
	searcher.search(new JSONSearch.BooleanQuery(clauses), 10, function (err, docs) {
		if (!err) {
			console.log(docs);
		} else {
			console.error(err);
		}
		//console.profileEnd();
	});
}

function termQueryBooleanClause(field, term, occur) {
	return new JSONSearch.BooleanClause(new JSONSearch.TermQuery(field, term), occur);
}

function testQueryStringSearch(qs, defaultField) {
	searcher.search(JSONSearch.QueryParser.parse(qs, defaultField), 10, function (err, docs) {
		if (!err) {
			console.log(docs);
		} else {
			console.error(err);
		}
	});
}

/**
 * Example Searches
 */

//testTermSearch("body", "test");

testBooleanSearch([
	termQueryBooleanClause("body", "dynamic", JSONSearch.Occur.MUST), 
	termQueryBooleanClause("body", "compiled", JSONSearch.Occur.MUST_NOT)
]);