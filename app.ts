import { App } from "astal/gtk3";
import { readFile } from "astal/file";
import GLib from "gi://GLib?version=2.0"; 
import style from "./scss/style.scss";
import Bar from "./widget/Bar";
import MusicWidget from "./widget/MusicWidget";
import Notfications from "./widget/Notifications";
import Menu, { openMenu } from "./widget/Menu";
import Config from "./util/confType";

export const config = JSON.parse(readFile(`${GLib.getenv("HOME")}/.config/ags/config.json`)) as Config;

App.start({
	css: style,
	icons: `${SRC}/icons`,

	main() {
		App.get_monitors().map((monitor, id) => {
			Bar(monitor, id);
			Notfications(monitor);
		});
		MusicWidget();
		Menu();
	},

	requestHandler(request: string, res: (response: any) => void) {
		if (request.startsWith("menu ")) {
			res(openMenu(request.substring(5)));
			return;
		}
	},
});
