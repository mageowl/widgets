import { Gtk } from "astal/gtk3";
import { BoxProps, EventBoxProps } from "astal/gtk3/widget";
import { Binding } from "astal";
import { modify } from "../../util/fns";

export interface ComponentProps {
	combine?: boolean;
}
export interface ComponentMetaProps extends BoxProps {
	className?: string | Binding<string>;
}

export function Component<P>(
	fn: (props: P) => Gtk.Widget | Binding<Gtk.Widget>,
	meta?: ComponentMetaProps,
): (props: P & ComponentProps) => Gtk.Widget {
	return (props) => (
		<box
			{...meta}
			className={
				meta?.className
					? modify(
							meta.className,
							(cn) => "component " + (props.combine ? "combine " : "") + cn,
						)
					: "component " + (props.combine ? "combine " : "")
			}
		>
			{fn(props)}
		</box>
	);
}

export function EventComponent<P>(
	fn: (props: P) => Gtk.Widget | Binding<Gtk.Widget>,
	events?: EventBoxProps,
	meta?: ComponentMetaProps,
): (props: P & ComponentProps) => Gtk.Widget {
	return (props) => (
		<eventbox {...events}>
			<box
				{...meta}
				className={
					meta?.className
						? modify(
								meta.className,
								(cn) => "component " + (props.combine ? "combine " : "") + cn,
							)
						: "component " + (props.combine ? "combine " : "")
				}
			>
				{fn(props)}
			</box>
		</eventbox>
	);
}
