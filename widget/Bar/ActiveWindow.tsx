import { bind } from "astal";
import { hyprland } from "../../util/libs";
import { Component } from "./Component";

export default Component(() => (
	<label label={bind(hyprland, "focusedClient").as((client) => client.title)} />
));
