import { Gtk } from "astal/gtk3";
import { bind, Variable } from "astal";
import AstalNotifd from "gi://AstalNotifd?version=0.1";

interface NotifProps {
	notif: AstalNotifd.Notification;
	closing: Variable<boolean>;
}
export default function Notification({ notif, closing }: NotifProps) {
	return (
		<eventbox onClick={() => notif.dismiss()}>
			<revealer revealChild={bind(closing).as((x) => !x)}>
				<box className="Notification">
					{notif.appIcon && <icon icon={notif.appIcon} />}
					{notif.image && (
						<box
							className="icon"
							valign={Gtk.Align.CENTER}
							css={`
								background-image: url("${notif.image}");
							`}
						/>
					)}
					<box className="info" vertical hexpand>
						<label
							className="summary"
							label={bind(notif, "summary")}
							wrap
							xalign={0}
						/>
						<label
							className="body"
							label={bind(notif, "body")}
							wrap
							xalign={0}
							yalign={0}
							maxWidthChars={40}
						/>
						{notif.actions.length > 0 && (
							<box className="actions" spacing={8}>
								{notif.actions.map(({ id, label }) => (
									<button
										onClicked={() => {
											notif.invoke(id);
											notif.dismiss();
										}}
										cursor="pointer"
										hexpand
									>
										<label label={label} />
									</button>
								))}
							</box>
						)}
					</box>
				</box>
			</revealer>
		</eventbox>
	);
}
