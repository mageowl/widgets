import { App } from "astal/gtk3";
import style from "./scss/style.scss";
import Bar from "./widget/Bar";
import MusicWidget from "./widget/MusicWidget";
import Notfications from "./widget/Notifications";
import Menu, { openMenu } from "./widget/Menu";

App.start({
	css: style,
	icons: `${SRC}/assets/icons`,

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
