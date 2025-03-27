import { bind } from "astal";
import AstalMpris from "gi://AstalMpris?version=0.1";
import { trunc } from "../../util/fns";

export default (player: AstalMpris.Player) => {
	const coverCss = bind(player, "artUrl").as(
		(url) => `background-image: url('${url}');`,
	);
	const title = bind(player, "title").as((title) => title || "Unknown Track");
	const artist = bind(player, "artist").as(
		(artist) => trunc(artist, 20) || "Unknown Artist",
	);
	const position = bind(player, "position").as((p) =>
		player.length > 0 ? p / player.length : 0,
	);

	const time = bind(player, "position").as(
		(p) =>
			`${Math.floor(p / 60)}:${(Math.round(p) % 60).toString().padStart(2, "0")}`,
	);

	return (
		<box
			className="player"
			visible={bind(player, "playbackStatus").as(
				(status) => status !== AstalMpris.PlaybackStatus.STOPPED,
			)}
		>
			<eventbox onClick={() => player.play_pause()} cursor="pointer">
				<box
					className={bind(player, "playbackStatus").as(
						(s) =>
							"cover-art" +
							(s === AstalMpris.PlaybackStatus.PLAYING ? "" : " dim"),
					)}
					css={coverCss}
				>
					<icon icon="paused-symbolic" hexpand />
				</box>
			</eventbox>
			<box className="metadata" vertical>
				<label label={title} wrap />
				<label className="dim" label={artist} wrap />
				<box vexpand>
					<button onClick={() => player.previous()} hexpand>
						<icon icon="prev-symbolic" />
					</button>
					<label
						visible={bind(player, "length").as((l) => l > 0)}
						label={time}
					/>
					<button onClick={() => player.next()} hexpand>
						<icon icon="next-symbolic" />
					</button>
				</box>
				<slider
					visible={bind(player, "length").as((l) => l > 0)}
					onDragged={({ value }) => (player.position = value * player.length)}
					value={position}
				/>
			</box>
		</box>
	);
};
