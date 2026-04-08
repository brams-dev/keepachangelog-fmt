export type Change = {
	type: 'change';
	text: string[];
};

export type Section = {
	type: 'section';
	title: string;
	changes: Change[];
};

export type Release = {
	type: 'release';
	version: string;
	date?: string;
	label?: string;
	sections: Section[];
};

export type Changelog = {
	type: 'changelog';
	title: string;
	preamble: string[];
	releases: Release[];
};
