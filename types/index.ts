export interface OddsData {
	runner: string;
	bookkeeper: string;
	fixedP: number;
	fixedW: number;
}

export interface RunnerRow {
	runner: string;
	[bookkeeper: string]: string | undefined;
}