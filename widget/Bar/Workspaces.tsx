import AstalHyprland from "gi://AstalHyprland?version=0.1";
import { bind } from "astal";
import { Widget, Gtk } from "astal/gtk3";
import { hyprland } from "../../util/libs";

function WorkspaceIndicator(wsId: number, monitorId: number): Gtk.Widget {
	let ws =
		hyprland.get_workspace(wsId) ??
		AstalHyprland.Workspace.dummy(wsId, hyprland.get_monitor(monitorId));

	const className = (self: Widget.Button) =>
		(self.className =
			"indicator" +
			(ws.clients.length > 0 ? " active" : "") +
			(ws.monitor.activeWorkspace.id === ws.id && ws.monitor.id === monitorId
				? " focused"
				: ""));

	let unsubMonitor: () => void;
	const updateMonitor = (self: Widget.Button) => {
		if (unsubMonitor) unsubMonitor();
		unsubMonitor = bind(ws.monitor, "activeWorkspace").subscribe(() => {
			className(self);
		});
	};

	let unsubWorkspace: () => void;
	const updateWorkspace = (self: Widget.Button) => {
		if (unsubWorkspace) unsubWorkspace();
		ws =
			hyprland.get_workspace(wsId) ??
			AstalHyprland.Workspace.dummy(wsId, hyprland.get_monitor(monitorId));

		className(self);
		updateMonitor(self);
		unsubWorkspace = bind(ws, "clients").subscribe(() => {
			className(self);
		});
	};

	return (
		<button
			setup={(self) => {
				updateWorkspace(self);
				self.hook(hyprland, "workspace-added", (self, targetWs) => {
					if (targetWs.id === wsId) updateWorkspace(self);
				});
				self.hook(hyprland, "workspace-removed", (self, _) => {
					if (ws.clients.length > 0) updateWorkspace(self);
				});
			}}
			onClick={() => hyprland.dispatch("workspace", wsId.toString())}
		/>
	);
}

let currentWorkspaces: { [monitor: number]: Gtk.Widget[] } = {};
const workspacesChanged = (self: Widget.Box, monitor: number) => {
	const workspaceCount = Math.max(5, ...hyprland.workspaces.map((w) => w.id));

	if (currentWorkspaces[monitor]?.length !== workspaceCount) {
		const indicators = [...Array(workspaceCount).keys()].map((i) => {
			return WorkspaceIndicator(i + 1, monitor);
		});
		currentWorkspaces[monitor] = indicators;
		self.children = indicators;
	}
};

export default ({ monitor }: { monitor: number }) => (
	<box
		className="component Workspaces"
		spacing={6}
		setup={(self) => {
			workspacesChanged(self, monitor);
			self.hook(hyprland, "workspace-added", (self) =>
				workspacesChanged(self, monitor),
			);
			self.hook(hyprland, "workspace-removed", (self) =>
				workspacesChanged(self, monitor),
			);
		}}
	></box>
);
