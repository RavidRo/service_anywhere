// export const enum Status {
// 'received',
// 'in preparation',
// 'ready to deliver',
// 'assigned',
// 'on the way',
// 'delivered',
// 'canceled',
// }
export const Status: string[] = [
	'received',
	'in preparation',
	'ready to deliver',
	'assigned',
	'on the way',
	'delivered',
	'canceled',
];

export const StatusToNumber: Map<string, number> = new Map([
	['received', 0],
	['in preparation', 1],
	['ready to deliver', 2],
	['assigned', 3],
	['on the way', 4],
	['delivered', 5],
	['canceled', 6],
]);
