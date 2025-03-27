export interface DrunMenu {
	type: "drun";
	icon: string;
	placeholder: string;
	color: string;
}

export interface SelectMenu {
	type: "select";
	icon: string;
	placeholder: string;
	color: string;
	entries: MenuEntry[] | (() => MenuEntry[]);
}
export interface MenuEntry {
	name: string;
	keywords?: string[];
	onChoose: () => Promise<boolean>;
}

export interface PromptMenu {
	type: "prompt";
	icon: string;
	placeholder: string;
	color: string;
	onInput: (input: string) => Promise<boolean>;
}
export interface PromptHistoryMenu {
	type: "promptHistory";
	icon: string;
	placeholder: string;
	color: string;
	onInput: (input: string) => Promise<string>;
}

export type MenuConf = DrunMenu | SelectMenu | PromptMenu | PromptHistoryMenu;
