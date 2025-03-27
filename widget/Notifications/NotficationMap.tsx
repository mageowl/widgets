import { timeout, Variable } from "astal";
import { Subscribable } from "astal/binding";
import { Gtk } from "astal/gtk3";
import { notifd } from "../../util/libs";
import Notification from "./Notification";
import AstalNotifd from "gi://AstalNotifd?version=0.1";

interface NotificationEntry {
	notif: AstalNotifd.Notification;
	closing: Variable<boolean>;
}

export default class NotifcationMap implements Subscribable<Gtk.Widget[]> {
	private notifications: Map<number, NotificationEntry> = new Map();
	private widgets: Variable<Gtk.Widget[]> = Variable([]);

	constructor() {
		notifd.notifications.forEach((notif) => {
			const closing = Variable(false);

			this.set(notif.id, {
				notif: notif,
				closing,
			});
		});

		notifd.connect("notified", (_, id) => {
			const closing = Variable(false);

			this.set(id, {
				notif: notifd.get_notification(id)!,
				closing,
			});
		});

		notifd.connect("resolved", (_, id) => {
			if (this.notifications.has(id)) {
				this.notifications.get(id)!.closing.set(true);
				timeout(200, () => this.delete(id));
			} else this.delete(id);
		});
	}

	private set(id: number, value: NotificationEntry) {
		this.notifications.set(id, value);
		this.notify();
	}
	private delete(id: number) {
		this.notifications.delete(id);
		this.notify();
	}
	private notify() {
		this.widgets.set(
			[...this.notifications.values()]
				.map(({ notif, closing }) => (
					<Notification notif={notif} closing={closing} />
				))
				.reverse(),
		);
	}

	dismissAll() {
		[...this.notifications.entries()].forEach(([id, { closing }]) => {
			closing.set(true);
			timeout(200, () => {
				this.delete(id);
				notifd.get_notification(id)!.dismiss();
			});
		});
	}

	get(): Gtk.Widget[] {
		return this.widgets.get();
	}
	subscribe(callback: (value: Gtk.Widget[]) => void): () => void {
		return this.widgets.subscribe(callback);
	}
}
