import { App, Gdk, Astal, Widget } from "astal/gtk3";
import { Variable } from "astal";
import AstalApps from "gi://AstalApps?version=0.1";
import menus from "./Menu/menus";
import { MenuConf, MenuEntry } from "./Menu/MenuConf";
import { fuzzyQuery } from "../util/fns";

function ListEntry(entry: MenuEntry, selected: boolean) {
	return (
		<button
			className={selected ? "selected list-entry" : "list-entry"}
			css={selected ? `background-color: ${menuConf.get().color}` : ""}
			onClicked={entry.onChoose}
			canFocus={false}
		>
			<box hexpand>
				{/*<icon icon={app.iconName} />*/}
				<label
					className="name"
					xalign={0}
					hexpand
					truncate
					label={entry.name}
				/>
			</box>
		</button>
	);
}

const menuConf: Variable<MenuConf> = Variable({
	type: "select",
	color: "white",
	icon: "next",
	placeholder: "temp",
	entries: [],
});
let savedEntries: MenuEntry[] | null = null;

export function openMenu(name: string): string {
	const menu = menus[name];
	if (menu == null) return `unknown menu: ${name}`;

	menuConf.set(menu);
	App.toggle_window("menu");

	return "ok";
}

export default function Menu() {
	const apps = new AstalApps.Apps();

	const state = Variable({ filter: "", selected: 0 });
	const list: Variable<MenuEntry[]> = Variable.derive(
		[menuConf, state],
		(menuConf, state): MenuEntry[] => {
			switch (menuConf.type) {
				case "drun":
					return apps.fuzzy_query(state.filter).map((application) => ({
						name: application.name.toLowerCase(),
						onChoose: () => {
							application.launch();
							return Promise.resolve(true);
						},
					}));
				case "select":
					if (savedEntries == null)
						if (menuConf.entries instanceof Function)
							savedEntries = menuConf.entries();
						else savedEntries = menuConf.entries;

					return fuzzyQuery(savedEntries, state.filter);
				case "promptHistory":
					if (savedEntries === null) savedEntries = [];
					console.log(savedEntries);
					return [...savedEntries];

				default:
					return [];
			}
		},
	);
	const input = (
		<entry
			text={state(({ filter }) => filter)}
			onChanged={(self) => state.set({ filter: self.text, selected: 0 })}
			hexpand
			onActivate={onEnter}
		/>
	);

	function onKeypress(_self: Widget.Window, event: Gdk.Event) {
		let key = event.get_keyval()[1];
		if (key === Gdk.KEY_Escape) {
			App.toggle_window("menu");
		} else if (key === Gdk.KEY_Tab) {
			let { filter, selected } = state.get();
			let len = list.get().length;
			state.set({ filter, selected: (selected + 1) % len });
		}
	}
	async function onEnter() {
		const conf: MenuConf = menuConf.get();
		if (conf.type === "prompt") {
			if (await conf.onInput(state.get().filter)) App.toggle_window("menu");
		} else if (conf.type === "promptHistory") {
			const { filter } = state.get();
			const message = await conf.onInput(filter);
			savedEntries?.unshift({
				name: message,
				keywords: [],
				onChoose: () => {
					state.set({ filter, selected: 0 });
					return Promise.resolve(false);
				},
			});
			state.set({ filter: "", selected: 0 });
		} else if (await list.get()[state.get().selected]?.onChoose())
			App.toggle_window("menu");
	}

	return (
		<window
			className="Menu"
			name="menu"
			namespace="launcher-menu"
			application={App}
			widthRequest={640}
			heightRequest={400}
			anchor={Astal.WindowAnchor.TOP}
			marginTop={128}
			visible={true}
			keymode={Astal.Keymode.EXCLUSIVE}
			onKeyPressEvent={onKeypress}
			onShow={() => {
				savedEntries = null;
				state.set({ filter: "", selected: 0 });
				input.grab_focus();
				if (menuConf.get().placeholder === "temp") App.toggle_window("menu");
			}}
		>
			<box vertical>
				<box
					className={menuConf(({ type }) =>
						type === "prompt" ? "search no-list" : "search",
					)}
				>
					<icon
						icon={menuConf(({ icon }) => `${icon}-symbolic`)}
						css={menuConf(({ color }) => `color: ${color};`)}
					/>
					<overlay>
						{input}
						<label
							className={menuConf(({ placeholder }) =>
								placeholder.includes(" ") ? "has-space dim" : "dim",
							)}
							label={menuConf(({ placeholder }) => placeholder)}
							xalign={0}
							visible={state(({ filter }) => filter.length === 0)}
						/>
					</overlay>
				</box>
				<box
					vexpand
					className="list"
					visible={menuConf(({ type }) => type !== "prompt")}
				>
					<scrollable vexpand hexpand canFocus={false}>
						<box vertical spacing={4} className="inner">
							{list((list) =>
								list.map((entry, i) =>
									ListEntry(entry, i === state.get().selected),
								),
							)}
						</box>
					</scrollable>
				</box>
			</box>
		</window>
	);
}
