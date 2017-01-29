function matchType(types, scanner) {
	for (let i = 0; i < types.length; i++) {
		const type = types[i];

		const result = type.match(scanner);
		scanner.popAll();

		if (result === null || result === false || result === undefined) {
			continue;
		}

		return { type: type, data: result };
	}
}

exports.matchType = matchType;