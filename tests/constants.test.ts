import { describe, expect, test } from 'vitest';
import { RELEASE_HEADING_REGEX } from '../src/constants';

describe('RELEASE_HEADING_REGEX', () => {
	test('unreleased', () => {
		const matches = RELEASE_HEADING_REGEX.exec('## [Unreleased]');

		expect([...(matches ?? [])]).toEqual([
			'## [Unreleased]',
			'Unreleased',
			undefined,
			undefined,
		]);
	});

	test('release', () => {
		const matches = RELEASE_HEADING_REGEX.exec('## [1.0.0]');

		expect([...(matches ?? [])]).toEqual([
			'## [1.0.0]',
			'1.0.0',
			undefined,
			undefined,
		]);
	});

	test('release with date', () => {
		const matches = RELEASE_HEADING_REGEX.exec('## [1.0.0] - 2026-04-08');

		expect([...(matches ?? [])]).toEqual([
			'## [1.0.0]',
			'1.0.0',
			'2026-04-08',
			undefined,
		]);
	});

	test('release with label', () => {
		const matches = RELEASE_HEADING_REGEX.exec('## [1.0.0] - (Sprint x)');

		expect([...(matches ?? [])]).toEqual([
			'## [1.0.0]',
			'1.0.0',
			undefined,
			'Sprint x',
		]);
	});

	test('release with date and label', () => {
		const matches = RELEASE_HEADING_REGEX.exec(
			'## [1.0.0] - 2026-04-08 (Sprint x)',
		);

		expect([...(matches ?? [])]).toEqual([
			'## [1.0.0]',
			'1.0.0',
			'2026-04-08',
			'Sprint x',
		]);
	});
});
