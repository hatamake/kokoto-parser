const {Token} = require('./token.js');

class LinkToken extends Token {
	constructor(title, href) {
		super();

		this.title = title;
		this.href = href;
	}

	static match(scanner) {
		scanner.mark();					// [start]

		if (!scanner.ahead('[')) {
			return null;
		}

		scanner.skip(+1);
		scanner.mark();					// [start, titleStart]

		if (!scanner.find(']')) {
			scanner.popAndBack();
			scanner.popAndBack();
			return null;
		}

		const title = scanner.pop();	// [start]

		if (!scanner.find('(')) {
			scanner.popAndBack();
			return null;
		}

		scanner.skip(+1);
		scanner.mark();					// [start, hrefStart]

		if (!scanner.find(')')) {
			scanner.popAndBack();
			scanner.popAndBack();
			return null;
		}

		const href = scanner.pop();

		return { title: title, href: href };
	}

	static parse(scanner, data) {
		return new LinkToken(data.title, data.href);
	}

	render(options, callback) {
		callback(null, `<a href="${this.href}">${this.title}</a>`)
	}
}

exports.LinkToken = LinkToken;