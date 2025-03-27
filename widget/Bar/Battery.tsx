import AstalBattery from "gi://AstalBattery?version=0.1";
import { battery } from "../../util/libs";
import { bind } from "astal";
import { Component } from "./Component";

export default Component(() => (
	<>
		<icon
			icon={bind(battery, "batteryIconName").as(() => {
				if (battery.state === AstalBattery.State.CHARGING) {
					return "battery-charging-symbolic";
				} else {
					const levels = [0.1, 0.33, 0.75, 1];
					return `battery-${levels.findIndex((l) => battery.percentage <= l)}-symbolic`;
				}
			})}
		/>
		<label
			label={bind(battery, "percentage").as((p) => `${Math.round(p * 100)}%`)}
		/>
	</>
));
