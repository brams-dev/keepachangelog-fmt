import { RELEASE_HEADING_REGEX } from './constants';
import type { Change, Changelog, Release, Section } from './types';

const SECTION_TITLES = ['Added', 'Changed', 'Removed', 'Fixed'];

const isTitleHeading = (line: string) => line.startsWith('# ');
const isReleaseHeading = (line: string) => line.startsWith('## [');
const isSectionHeading = (line: string) =>
	line.startsWith('### ') &&
	SECTION_TITLES.includes(line.replace('### ', ''));
const isEmptyLine = (line: string) => line === '';
const isValidPreambleLine = (line: string) =>
	!isTitleHeading(line) && !isReleaseHeading(line) && !isSectionHeading(line);
const isBullet = (line: string) => line.startsWith('- ');

const removeTrailingNewLines = (lines: Array<string>) => {
	let newArray = [...lines];

	while (isEmptyLine(newArray[0])) {
		newArray = newArray.slice(1);
	}

	while (isEmptyLine(newArray[newArray.length - 1])) {
		newArray = newArray.slice(0, -1);
	}

	return newArray;
};

export default function parse(text: string) {
	const changelog: Changelog = {
		type: 'changelog',
		title: '# Changelog',
		preamble: [],
		releases: [],
	};

	const lines = text.split('\n');
	let lineNumber = 0;

	const parseTitle = () => {
		const titleLine = lines[lineNumber];
		if (isTitleHeading(titleLine)) {
			changelog.title = titleLine;
			lineNumber++;
		}
	};

	const parsePreamble = () => {
		while (lineNumber < lines.length) {
			const line = lines[lineNumber];

			if (!isValidPreambleLine(line)) break;

			changelog.preamble.push(line);

			lineNumber++;
		}

		changelog.preamble = removeTrailingNewLines(changelog.preamble);
	};

	const parseChanges = () => {
		const changes: Change[] = [];

		while (lineNumber < lines.length) {
			const line = lines[lineNumber];

			if (isEmptyLine(line)) {
				lineNumber++;

				continue;
			}

			if (!isBullet(line)) {
				break;
			}

			changes.push({
				type: 'change',
				text: [line.replace('- ', '')],
			});

			lineNumber++;
		}

		return changes;
	};

	const parseSection = (): Section => {
		const line = lines[lineNumber];

		const title = line.replace('### ', '');
		lineNumber++;

		const changes = parseChanges();

		const section: Section = {
			type: 'section',
			title,
			changes,
		};

		return section;
	};

	const parseSections = (): Section[] => {
		const sections: Section[] = [];

		while (lineNumber < lines.length) {
			const line = lines[lineNumber];

			if (isEmptyLine(line)) {
				lineNumber++;

				continue;
			}

			if (!isSectionHeading(line)) {
				break;
			}

			sections.push(parseSection());
		}

		return sections;
	};

	const parseRelease = () => {
		const line = lines[lineNumber];
		const matches = RELEASE_HEADING_REGEX.exec(line.trim());

		if (!matches)
			throw new Error(
				`Invalid release heading on line ${lineNumber}: "${line}"`,
			);

		const [_, version, date, label] = matches;
		lineNumber++;

		const sections = parseSections();

		const release: Release = {
			type: 'release',
			version,
			date,
			label,
			sections,
		};

		changelog.releases.push(release);
	};

	const parseReleases = () => {
		while (lineNumber < lines.length) {
			const line = lines[lineNumber];

			if (isEmptyLine(line)) {
				lineNumber++;

				continue;
			}

			if (!isReleaseHeading(line)) {
				lineNumber++;

				break;
			}

			parseRelease();
		}
	};

	parseTitle();
	parsePreamble();
	parseReleases();

	return changelog;
}
