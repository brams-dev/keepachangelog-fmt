import fs from 'node:fs/promises';
import parse from './parse';

async function main() {
	const text = await fs.readFile('CHANGELOG.md', { encoding: 'utf8' });

	const ast = parse(text);

	console.log(ast);
}

main();
