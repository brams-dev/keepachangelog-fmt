import { describe, expect, test } from 'vitest';
import { RELEASE_HEADING_REGEX } from '../src/constants';

describe('RELEASE_HEADING_REGEX', () => {
	test('unreleased', () => {
		const matches = RELEASE_HEADING_REGEX.exec('## [Unreleased]');

		expect(matches).toEqual([
			'## [Unreleased]',
			'Unreleased',
			undefined,
			undefined,
		]);
	});

	test('release', () => {
		const matches = RELEASE_HEADING_REGEX.exec('## [1.0.0]');

		expect(matches).toEqual(['## [1.0.0]', '1.0.0', undefined, undefined]);
	});
});
