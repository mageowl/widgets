import { audio } from "../../util/libs";
import { Component } from "./Component";
import { bind, Variable } from "astal";

const volumeIcon = Variable.derive(
	[bind(audio.defaultSpeaker, "volume"), bind(audio.defaultSpeaker, "mute")],
	(volume, mute) => {
		const level = mute
			? "mute"
			: volume >= 0.5
				? "2"
				: volume >= 0.33
					? "1"
					: "0";
		return `volume-${level}-symbolic`;
	},
);

export const Volume = Component(() => {
	return (
		<>
			<icon icon={bind(volumeIcon)} />
			<label
				label={bind(audio.defaultSpeaker, "volume").as(
					(volume) => `${Math.floor(volume * 100)}%`,
				)}
			/>
		</>
	);
});

export const MicGain = Component(() => (
	<>
		<icon
			icon={bind(audio.defaultMicrophone, "mute").as((mute) =>
				mute ? "mic-off-symbolic" : "mic-symbolic",
			)}
		/>
		<label
			label={bind(audio.defaultMicrophone, "volume").as(
				(volume) => `${Math.floor(volume * 100)}%`,
			)}
		/>
	</>
));
