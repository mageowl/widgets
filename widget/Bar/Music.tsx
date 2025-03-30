import { bind } from "astal";
import { EventComponent } from "./Component";
import { mpris } from "../../util/libs";
import AstalMpris from "gi://AstalMpris?version=0.1";
import { App } from "astal/gtk3";

export default EventComponent(
	({ monitorId }: { monitorId: number }) => {
		return bind(mpris, "players").as((players) =>
			players.length > 0 ? (
				<>
					<icon
						icon={bind(players[0], "playbackStatus").as((status) =>
							status === AstalMpris.PlaybackStatus.PLAYING
								? "music-symbolic"
								: "music-paused-symbolic",
						)}
						className={bind(players[0], "playbackStatus").as((status) =>
							status === AstalMpris.PlaybackStatus.PLAYING ? "" : "dim",
						)}
					/>
					<label
						label={bind(players[0], "title").as(
							(title: string | null) => title?.replace(/\s?\([^)]+\)/g, "") || "Unknown Track",
						)}
					/>
				</>
			) : (
				<></>
			),
		);
	},
	{
		onClick: () => App.toggle_window("music"),
		cursor: "pointer",
	},
	{
		className: "Music",
		visible: bind(mpris, "players").as(
			(players) =>
				players.findIndex(
					(p) => p.playbackStatus !== AstalMpris.PlaybackStatus.STOPPED,
				) !== -1,
		),
	},
);
