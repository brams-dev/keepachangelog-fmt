import type { Changelog } from './types';

export default function format(changelog: Changelog): string {
	const preambleText =
		changelog.preamble.length !== 0
			? `\n\n${changelog.preamble.join('\n')}\n`
			: '';

	const releasesText = changelog.releases
		.map((release) => {
			let title = `## [${release.version.trim()}]`;

			if (release.date || release.label) {
				title += ' -';

				if (release.date) title += ` ${release.date}`;
				if (release.label) title += ` (${release.label.trim()})`;
			}

			const sections = release.sections
				.map((section) => {
					const title = `### ${section.title.trim()}`;

					const changes = section.changes
						.map((change) => {
							const line = change.text[0].trim();

							return `- ${line}${
								line[line.length - 1] === '.' ? '' : '.'
							}`;
						})
						.join('\n');

					if (changes === '') return title;

					return `${title}\n\n${changes}`;
				})
				.join('\n\n');

			return `${title}\n\n${sections}`;
		})
		.join('\n\n\n');

	return `${changelog.title}${preambleText}\n\n${releasesText}\n`;
}
