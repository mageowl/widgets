import AstalBattery from "gi://AstalBattery?version=0.1";
import AstalHyprland from "gi://AstalHyprland?version=0.1";
import AstalWp from "gi://AstalWp?version=0.1";
import { assert } from "./fns";
import AstalMpris from "gi://AstalMpris?version=0.1";
import AstalNotifd from "gi://AstalNotifd?version=0.1";

export const hyprland = AstalHyprland.get_default();
export const battery = AstalBattery.get_default();
export const { audio, video } = assert(
	AstalWp.get_default(),
	"Wireplumber required for some modules to work.",
);
export const mpris = AstalMpris.get_default();
export const notifd = AstalNotifd.get_default();
