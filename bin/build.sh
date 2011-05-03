#!/bin/bash

ROOT_DIR="../"
SRC_DIR=${ROOT_DIR}"src/"
DIST_DIR=${ROOT_DIR}"dist/"
ALL_LIST=( ${SRC_DIR}"common.js" ${SRC_DIR}"util/EventEmitter.js" ${SRC_DIR}"util/Stream.js" ${SRC_DIR}"util/Collector.js" ${SRC_DIR}"search/DocumentTerms.js" ${SRC_DIR}"search/TopDocumentsCollector.js" ${SRC_DIR}"index/DefaultTermIndexer.js" ${SRC_DIR}"util/ArrayStream.js" ${SRC_DIR}"index/MemoryIndex.js" ${SRC_DIR}"search/DefaultSimilarity.js" ${SRC_DIR}"search/Searcher.js" ${SRC_DIR}"search/TermQuery.js" ${SRC_DIR}"search/NormalizedQuery.js" ${SRC_DIR}"search/BooleanClause.js" ${SRC_DIR}"search/BooleanQuery.js" )
ALL_FILE=${DIST_DIR}"all.js"
EXTERN_LIST=( ${SRC_DIR}"interface/typedefs.js" ${SRC_DIR}"interface/Emitter.js" ${SRC_DIR}"interface/ReadableStream.js" ${SRC_DIR}"interface/WritableStream.js" ${SRC_DIR}"interface/TermVectorEntry.js" ${SRC_DIR}"interface/TermVector.js" ${SRC_DIR}"interface/Similarity.js" ${SRC_DIR}"interface/TermIndexer.js" ${SRC_DIR}"interface/Index.js" ${SRC_DIR}"interface/Query.js" )

COMPILER_JAR=${ROOT_DIR}"bin/closure/compiler.jar"
COMPILE_OPTIONS="--language_in ECMASCRIPT3 --jscomp_warning accessControls --jscomp_warning ambiguousFunctionDecl --jscomp_warning checkRegExp --jscomp_warning checkTypes --jscomp_warning checkVars --jscomp_warning constantProperty --jscomp_warning deprecated --jscomp_warning externsValidation --jscomp_warning fileoverviewTags --jscomp_warning globalThis --jscomp_warning internetExplorerChecks --jscomp_warning invalidCasts --jscomp_warning missingProperties --jscomp_warning nonStandardJsDocs --jscomp_warning strictModuleDepCheck --jscomp_warning typeInvalidation --jscomp_warning undefinedVars --jscomp_warning unknownDefines --jscomp_warning uselessCode --jscomp_warning visibility"

#
# Targets
#

function clean {
	rm -r -f ${DIST_DIR}
}

function setup {
	mkdir ${DIST_DIR}
}

function compile {
	local IN_ARGS=
	local IN_LENGTH=${#ALL_LIST[@]}
	for ((i=0;i<${IN_LENGTH};i++)); do
		IN_ARGS=${IN_ARGS}"--js "${ALL_LIST[${i}]}" "
	done
	local IN_LENGTH=${#EXTERN_LIST[@]}
	for ((i=0;i<${IN_LENGTH};i++)); do
		IN_ARGS=${IN_ARGS}"--externs "${EXTERN_LIST[${i}]}" "
	done
	local OUT_FILE=${ALL_FILE}

	java -jar ${COMPILER_JAR} ${IN_ARGS} --js_output_file ${OUT_FILE} --compilation_level SIMPLE_OPTIMIZATIONS ${COMPILE_OPTIONS} --formatting PRETTY_PRINT
}

#
# Operations
#

clean
setup
compile
