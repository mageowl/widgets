import { Variable } from "astal";
import { Component } from "./Component";

const time = Variable("").poll(1000, "date +'%H:%M'");
const date = Variable("").poll(360_0000, "date +'%m/%d'");

export const Time = Component(() => <label label={time()} />);
export const Date = Component(() => (
	<>
		<icon icon="calendar-symbolic" />
		<label label={date()} />
	</>
));
