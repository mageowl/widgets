import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { Time, Date } from "./Bar/Time";
import { MicGain, Volume } from "./Bar/Volume";
import Battery from "./Bar/Battery";
import Workspaces from "./Bar/Workspaces";
import Music from "./Bar/Music";

export default function Bar(gdkmonitor: Gdk.Monitor, monitorId: number) {
	return (
		<window
			className="Bar"
			gdkmonitor={gdkmonitor}
			application={App}
			exclusivity={Astal.Exclusivity.EXCLUSIVE}
			anchor={
				Astal.WindowAnchor.BOTTOM |
				Astal.WindowAnchor.LEFT |
				Astal.WindowAnchor.RIGHT
			}
			marginBottom={10}
			marginTop={5}
			marginLeft={16}
			marginRight={16}
		>
			<centerbox>
				<box>
					<Time combine />
					<Date />

					<Workspaces monitor={monitorId} />
				</box>
				<box />
				<box halign={Gtk.Align.END}>
					<Music monitorId={monitorId} />

					<Volume combine />
					<MicGain />

					<Battery />
				</box>
			</centerbox>
		</window>
	);
}
