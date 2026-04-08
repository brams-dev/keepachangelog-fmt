import { expect, test } from 'vitest';

import parse from '../src/parse';
import { Release, Section } from '../src/types';

const defaultTitle = '# My Changelog';
const defaultPreamble = `This is my changelog.
Make sure to also checkout this link: blahblah.

Thank you.`;
const defaultPreambleArray = [
	'This is my changelog.',
	'Make sure to also checkout this link: blahblah.',
	'',
	'Thank you.',
];

const defaultEmptySections = `### Added

### Changed

### Removed

### Fixed
`;

const defaultEmptyUnreleased = `## [Unreleased]\n${defaultEmptySections}`;

const defaultEmptyRelease = `## [1.0.0] - 2026-04-08\n${defaultEmptySections}`;

const defaultEmptySectionsAst: Section[] = [
	{
		type: 'section',
		title: 'Added',
		changes: [],
	},

	{
		type: 'section',
		title: 'Changed',
		changes: [],
	},

	{
		type: 'section',
		title: 'Removed',
		changes: [],
	},
	{
		type: 'section',
		title: 'Fixed',
		changes: [],
	},
];

const defaultEmptyUnreleasedAst: Release = {
	type: 'release',
	version: 'Unreleased',
	date: undefined,
	label: undefined,
	sections: defaultEmptySectionsAst,
};

const defaultEmptyReleaseAst: Release = {
	type: 'release',
	version: '1.0.0',
	date: '2026-04-08',
	label: undefined,
	sections: defaultEmptySectionsAst,
};

test('parses a changelog with just a title', () => {
	const changelog = `${defaultTitle}`;

	const ast = parse(changelog);

	expect(ast).toEqual({
		type: 'changelog',
		title: defaultTitle,
		preamble: [],
		releases: [],
	});
});

test('parses a changelog with a title and preamble', () => {
	const changelog = `${defaultTitle}

${defaultPreamble}`;

	const ast = parse(changelog);

	expect(ast).toEqual({
		type: 'changelog',
		title: '# My Changelog',
		preamble: defaultPreambleArray,
		releases: [],
	});
});

test('parses a changelog with a title and preamble with no empty line between them', () => {
	const changelog = `${defaultTitle}\n${defaultPreamble}`;

	const ast = parse(changelog);

	expect(ast).toEqual({
		type: 'changelog',
		title: defaultTitle,
		preamble: defaultPreambleArray,
		releases: [],
	});
});

test('parses a changelog with a title and preamble with too many empty lines', () => {
	const changelog = `${defaultTitle}\n\n\n${defaultPreamble}\n\n\n\n\n\n`;

	const ast = parse(changelog);

	expect(ast).toEqual({
		type: 'changelog',
		title: defaultTitle,
		preamble: defaultPreambleArray,
		releases: [],
	});
});

test('parses a changelog with a title and an empty unreleased release', () => {
	const changelog = `${defaultTitle}\n${defaultEmptyUnreleased}`;

	const ast = parse(changelog);

	expect(ast).toEqual({
		type: 'changelog',
		title: defaultTitle,
		preamble: [],
		releases: [defaultEmptyUnreleasedAst],
	});
});

test('parses a changelog with a title, preamble and an empty unreleased release', () => {
	const changelog = `${defaultTitle}\n${defaultPreamble}\n${defaultEmptyUnreleased}`;

	const ast = parse(changelog);

	expect(ast).toEqual({
		type: 'changelog',
		title: defaultTitle,
		preamble: defaultPreambleArray,
		releases: [defaultEmptyUnreleasedAst],
	});
});

test('parses a changelog with a title, preamble and an empty release', () => {
	const changelog = `${defaultTitle}\n${defaultPreamble}\n${defaultEmptyRelease}`;

	const ast = parse(changelog);

	expect(ast).toEqual({
		type: 'changelog',
		title: defaultTitle,
		preamble: defaultPreambleArray,
		releases: [defaultEmptyReleaseAst],
	});
});

test('parses a changelog with a title, preamble and multiple releases', () => {
	const changelog = `${defaultTitle}

## [1.0.0] - 2026-04-08 (Sprint x)

### Added

- I added one thing


## [0.1.0] - 2026-04-07 (Sprint x)

### Removed

- The thing I removed.
`;

	const ast = parse(changelog);

	expect(ast).toEqual({
		type: 'changelog',
		title: defaultTitle,
		preamble: [],
		releases: [
			{
				type: 'release',
				version: '1.0.0',
				date: '2026-04-08',
				label: 'Sprint x',
				sections: [
					{
						type: 'section',
						title: 'Added',
						changes: [
							{
								type: 'change',
								text: ['I added one thing'],
							},
						],
					},
				],
			},
			{
				type: 'release',
				version: '0.1.0',
				date: '2026-04-07',
				label: 'Sprint x',
				sections: [
					{
						type: 'section',
						title: 'Removed',
						changes: [
							{
								type: 'change',
								text: ['The thing I removed.'],
							},
						],
					},
				],
			},
		],
	});
});
