const _last = require('lodash.last');
const async = require('async');
const Scanner = require('../util/scanner.js');
const matchType = require('../util/matchType.js');
const {ParagraphBlock} = require('../blocks/paragraph');

function parse(buffer, options) {
	const scanner = new Scanner(buffer);
	const blocks = [];

	while (!scanner.isAtEnd) {
		const match = matchType(scanner, options.blockTypes);
		let block;

		if (match) {
			block = match.type.parse(scanner, match.data, options);
		} else {
			block = ParagraphBlock.parse(scanner, null, options);
		}

		scanner.popAll();
		scanner.skipLineEnds();

		blocks.push(block);
	}

	return blocks.reduce(function(result, block) {
		block.constructor.integrate(result, _last(result), block);
		return result;
	}, []);
}

function render(blocks, options, callback) {
	async.map(blocks, function(block, callback) {
		block.render(options, callback);
	}, function(error, renderedBlocks) {
		if (error) {
			callback(error, null);
		} else {
			callback(null, renderedBlocks.join(''));
		}
	});
}

function parseAndRender(buffer, options, callback) {
	render(parse(buffer, options), options, callback);
}

exports.parse = parse;
exports.render = render;
exports.parseAndRender = parseAndRender;