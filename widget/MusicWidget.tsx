import { App, Gdk, Astal } from "astal/gtk3";
import { bind, Variable } from "astal";
import { mpris } from "../util/libs";
import Player from "./MusicWidget/Player";

export default function MusicWidget() {
	return (
		<window
			className="MusicWidget"
			name="music"
			application={App}
			anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT}
			marginRight={34}
			marginBottom={24}
			visible={false}
		>
			<box vertical spacing={8}>
				{bind(mpris, "players").as((players) => players.map(Player))}
			</box>
		</window>
	);
}
