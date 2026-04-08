import fs from 'node:fs/promises';
import parse from './parse';
import format from './format';

async function main() {
	const text = await fs.readFile('CHANGELOG.md', { encoding: 'utf8' });

	const ast = parse(text);

	const formatted = format(ast);

	await fs.writeFile('CHANGELOG.md', formatted, { encoding: 'utf8' });
}

main();
