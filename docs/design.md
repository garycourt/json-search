# JSON Search Design Document

## Things needed from an Index

*	termFreq(t,f,d)

	The number of times term `t` appears in field `f` in document `d`.

*	termFreq(t,*,d)

	The number of times term `t` appears in all fields in document `d`.
	
*	docFreq(t,f)

	The number of documents that term `t` appears in field `f`.

*	docFreq(t)

	The number of documents that term `t` appears in.

*	numDocs

	The number of documents in the index.

*	overlap(t[],d)

	The number of terms `t` in query `q` that are in document `d`.
	This could be computed from multiple calls to termFreq.

*	boost(d)

	The extra weight applied to document `d`.
	
*	boost(d,f)

	The extra weight applied to field `f` in document `d`.

*	length(d,f)

	The number of terms in field `f` in document `d`.
	
*	termProx(t,f,d)

	The positions of term `t` in field `f` in document `d`.

## Things needed from a Query

*	maxOverlap(q)

	The number of terms `t` that are in query `q`.

*	boost(q)

	The extra weight applied to query `q`.

## CouchDB Design Document

CouchDB should have the following maps/reduces:

*	inverted document

	key: [term, field]  //`null` field means all fields
	mapped:
		//total_rows is docFreq
		{
			_id : "id0",
			docBoost : 0.0,         //these optional attributes take up extra space
			docFieldBoost : 0.0,    //but results in much faster search
			docFieldTermsCount : 0, //as we don't have to look up each document
			termFreq : 0,
			termPos : [0,...],
			termOff : [0,...]
		}

## CouchDB calls

*	For each term `t`, get inverted document that contain `t` (in field `f`).
*	Get total number of documents in index (can be cached for performance).
