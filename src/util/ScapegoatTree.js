/**
 * @typedef {Array.<(string|number), ScapegoatTreeNode, ScapegoatTreeNode>}
 */

var ScapegoatTreeNode;

/**
 * @constructor
 * @param {number} [alpha]
 */

function ScapegoatTree(alpha) {
	this.a = (alpha && alpha >= 0.5 && alpha < 1 ? alpha : 0.5);
	this.lna = Math.log(1 / this.a);
	this.root = null;
	this.size = 0;
}

/**
 * @type {number}
 */

ScapegoatTree.prototype.a;

/**
 * @type {number}
 */

ScapegoatTree.prototype.lna;

/**
 * @type {ScapegoatTreeNode}
 */

ScapegoatTree.prototype.root;

/**
 * @type {number}
 */

ScapegoatTree.prototype.size;

/**
 * @private
 * @param {ScapegoatTreeNode} node
 * @return {number}
 */

function Scapegoat_size(node) {
	return node === null ? 0 : Scapegoat_size(node[1]) + Scapegoat_size(node[2]) + 1;
}

/**
 * @private
 * @param {ScapegoatTreeNode} node
 * @return {Array.<string|number>}
 */

function Scapegoat_toArray(node) {
	if (node === null) {
		return [];
	}
	//else
	return Scapegoat_toArray(node[1]).concat([ node[0] ], Scapegoat_toArray(node[2]));
}

/**
 * @private
 * @param {Array.<(string|number)>} arr
 * @return {ScapegoatTreeNode}
 */

function Scapegoat_toTree(arr) {
	var mid;
	if (arr.length === 0) {
		return null;
	}
	if (arr.length === 1) {
		return [arr[0], null, null];
	}
	mid = Math.floor(arr.length / 2);
	return [arr[mid], Scapegoat_toTree(arr.slice(0, mid)), Scapegoat_toTree(arr.slice(mid + 1))];
}

/**
 * @param {string|number} key
 */

ScapegoatTree.prototype.insert = function (key) {
	var maxHeight, stack, node, parent, nodeSize, brotherSize, parentSize, balance;
	
	if (this.root !== null) {
		this.size++;
		maxHeight = (Math.log(this.size) / this.lna) + 1;
		stack = [ this.root ];
		node = this.root;
		
		while (true) {
			if (node[0] > key) {
				if (node[1] !== null) {
					node = node[1];
				} else {
					node = node[1] = [key, null, null];
					break;
				}
			} else {
				if (node[2] !== null) {
					node = node[2];
				} else {
					node = node[2] = [key, null, null];
					break;
				}
			}
			stack[stack.length] = node;
		}
		
		if (stack.length + 1 > maxHeight) {  //rebalance tree
			parent = node;
			parentSize = 1;
			while (stack.length) {
				node = parent;
				nodeSize = parentSize;
				parent = stack.pop();
				if (parent[1] === node) {
					brotherSize = Scapegoat_size(parent[2]);
				} else {
					brotherSize = Scapegoat_size(parent[1]);
				}
				parentSize = nodeSize + brotherSize + 1;
				balance = parentSize * this.a;
				
				if (nodeSize > balance || brotherSize > balance) {  //found scapegoat
					node = Scapegoat_toTree(Scapegoat_toArray(parent));  //rebalance node
					if (stack.length === 0) {
						this.root = node;
					} else if (stack[stack.length - 1][1] === parent) {
						stack[stack.length - 1][1] = node;
					} else {
						stack[stack.length - 1][2] = node;
					}
					break;  //tree is balanced
				}
			}
		}
	} else {
		this.root = [key, null, null];
		this.size = 1;
	}
};

/**
 * @param {Array.<string|number>} keys
 */

ScapegoatTree.prototype.insertAll = function (keys) {
	var x, xl;
	for (x = 0, xl = keys.length; x < xl; ++x) {
		this.insert(keys[x]);
	}
};

/**
 * @param {string|number} startKey
 * @param {string|number} endKey
 * @param {boolean} [excludeStart]
 * @param {boolean} [excludeEnd]
 * @return {Array.<string|number>}
 */

ScapegoatTree.prototype.range = function (startKey, endKey, excludeStart, excludeEnd) {
	var stack = [],
		node = this.root,
		result = [];
	
	while (node !== null && node[0] !== startKey) {
		if (node[0] >= startKey) {
			stack[stack.length] = node;
			node = node[1];
		} else {
			node = node[2];
		}
	}
	
	if (node !== null && (!excludeStart || node[0] !== startKey)) {
		result[result.length] = node[0];
	}
	
	while (stack.length) {
		node = stack.pop();
		
		if (node[0] >= endKey) {
			if (!excludeEnd && node[0] === endKey) {
				result[result.length] = node[0];
			}
			break;
		}
		
		result[result.length] = node[0];
		node = node[2];
		
		while (node !== null) {
			stack[stack.length] = node;
			node = node[1];
		}
	}
	
	return result;
};

/**
 * @return {Array.<string|number>}
 */

ScapegoatTree.prototype.toArray = function () {
	return Scapegoat_toArray(this.root);
};


exports.ScapegoatTree = ScapegoatTree;