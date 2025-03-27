import { App, Astal, Gdk } from "astal/gtk3";
import { bind } from "astal";
import { notifd } from "../util/libs";
import NotifcationMap from "./Notifications/NotficationMap";

export default function Notfications(gdkmonitor: Gdk.Monitor) {
	const notifs = new NotifcationMap();

	return (
		<window
			className="Notifications"
			gdkmonitor={gdkmonitor}
			application={App}
			anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
			marginRight={24}
			marginTop={24}
			visible={bind(notifs).as((notifs) => notifs.length > 0)}
		>
			<box vertical>
				{/*<button onClick={() => notifs.dismissAll()} cursor="pointer">
					<label xalign={1} label="Dismiss all" />
				</button>*/}
				{bind(notifs)}
			</box>
		</window>
	);
}
