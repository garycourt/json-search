#!/bin/bash

ROOT_DIR="../"
SRC_DIR=${ROOT_DIR}"src/"
DIST_DIR=${ROOT_DIR}"dist/"
ALL_LIST=( ${SRC_DIR}"util/common.js" ${SRC_DIR}"document/Document.js" ${SRC_DIR}"search/ScoreDoc.js" ${SRC_DIR}"search/TopDocs.js" ${SRC_DIR}"search/Collector.js" ${SRC_DIR}"search/TopDocsCollector.js" ${SRC_DIR}"search/DocIdSetIterator.js" ${SRC_DIR}"search/Scorer.js" ${SRC_DIR}"search/Weight.js" ${SRC_DIR}"util/PriorityQueue.js" ${SRC_DIR}"search/HitQueue.js" ${SRC_DIR}"index/Index.js" ${SRC_DIR}"search/Query.js" ${SRC_DIR}"search/IndexSearcher.js" ${SRC_DIR}"search/Similarity.js" ${SRC_DIR}"search/DefaultSimilarity.js" ${SRC_DIR}"index/FieldInvertState.js" )
ALL_FILE=${DIST_DIR}"all.js"
EXTERNS_FILE=${SRC_DIR}"externs.js"

COMPILER_JAR=${ROOT_DIR}"bin/closure/compiler.jar"
COMPILE_OPTIONS="--language_in ECMASCRIPT5_STRICT --jscomp_warning nonStandardJsDocs --jscomp_warning checkTypes --jscomp_warning checkRegExp --jscomp_warning checkVars --jscomp_warning deprecated --jscomp_warning invalidCasts --jscomp_warning missingProperties --jscomp_warning undefinedVars --jscomp_warning unknownDefines --jscomp_warning visibility"

#
# Targets
#

function clean {
	rm -r -f ${DIST_DIR}
}

function setup {
	mkdir ${DIST_DIR}
}

function simple_compile {
	local IN_ARGS=
	local IN_LENGTH=${#ALL_LIST[@]}
	for ((i=0;i<${IN_LENGTH};i++)); do
		IN_ARGS=${IN_ARGS}"--js "${ALL_LIST[${i}]}" "
	done
	local OUT_FILE=${ALL_FILE}

	java -jar ${COMPILER_JAR} ${IN_ARGS} --externs ${EXTERNS_FILE} --js_output_file ${OUT_FILE} --compilation_level SIMPLE_OPTIMIZATIONS ${COMPILE_OPTIONS} --formatting PRETTY_PRINT
}

function advanced_compile {
	local IN_ARGS=
	local IN_LENGTH=${#ALL_LIST[@]}
	for ((i=0;i<${IN_LENGTH};i++)); do
		IN_ARGS=${IN_ARGS}"--js "${ALL_LIST[${i}]}" "
	done
	local OUT_FILE=${ALL_FILE}

	java -jar ${COMPILER_JAR} ${IN_ARGS} --externs ${EXTERNS_FILE} --js_output_file ${OUT_FILE} --compilation_level ADVANCED_OPTIMIZATIONS ${COMPILE_OPTIONS}
}

#
# Operations
#

clean
setup
simple_compile
