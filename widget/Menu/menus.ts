import { execAsync, timeout } from "astal";
import { MenuConf } from "./MenuConf";

const cmd = (...args: string[]): (() => Promise<boolean>) => {
	return async () => {
		await execAsync(args);
		return true;
	};
};

const menus: { [id: string]: MenuConf } = {
	drun: {
		type: "drun",
		icon: "rocket-search",
		color: "#f9a9d9",
		placeholder: "launch application",
	},
	quickAction: {
		type: "select",
		icon: "text-search",
		color: "#f9e2af",
		placeholder: "run action",

		entries: [
			{
				name: "reload ags",
				onChoose: cmd("fish", "-c", "reload_ags"),
			},
			{
				name: "sleep",
				keywords: ["slp"],
				onChoose: cmd("systemctl", "suspend"),
			},
			{
				name: "color picker",
				keywords: ["clr"],
				onChoose: async () => {
					timeout(200, () => execAsync(["hyprpicker", "-a"]));
					return true;
				},
			},
		],
	},
	calculator: {
		type: "promptHistory",
		icon: "calculator",
		color: "#a6e3a1",
		placeholder: "calculator",

		onInput(input: string) {
			return execAsync(["qalc", input]);
		},
	},
	commandPrompt: {
		type: "prompt",
		icon: "square-terminal",
		color: "#94e2d5",
		placeholder: "run command",

		async onInput(input: string) {
			await execAsync(["fish", "-c", input]).catch(() => null);
			return true;
		},
	},
};

export default menus;
