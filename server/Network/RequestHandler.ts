require('dotenv').config();

import express from 'express';
import * as socketio from 'socket.io';

import {ResponseMsg} from '../Response';

import guest from '../Interface/GuestInterface';
import dashboard from '../Interface/DashboardInterface';
import waiter from '../Interface/WaiterInterface';
import items from '../Interface/ItemsInterface';
import NotificationInterface from '../Interface/NotificationInterface';

import authenticator from '../Logic/Authentication/Authenticator';

import {AppDataSource} from '../Data/data-source';
import reset_all from '../Data/test_ResetDatabase';

let cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const statusOk = 400;
app.use(express.json());
let http = require('http').Server(app);
let io = require('socket.io')(http);

// use it before all route definitions
app.use(cors({origin: '*'}));

app.get('/', (_req, res) => {
	res.send('Hello World!');
});

function authenticate(
	token: string | undefined,
	permissionLevel: number,
	sendErrorMsg: (msg: string) => void,
	setErrorStatus: (status: number) => void,
	doIfLegal: (id: string) => void
) {
	if (token) {
		let response = authenticator.authenticate(token, permissionLevel);
		if (response.isSuccess()) {
			response.ifGood(doIfLegal);
		} else {
			setErrorStatus(400)
			sendErrorMsg(response.getError());
		}
	} else {
		setErrorStatus(400)
		sendErrorMsg('Token does not match any id');
	}
}

function sendResponse(
	response: ResponseMsg<any>,
	setStatus: (st: number) => void,
	send: (msg: any) => void
) {
	setStatus(response.getStatusCode());
	if (response.isSuccess()) {
		send(response.getData());
		return;
	}
	send(response.getError());
}

function checkInputs(
	inputs: string[],
	reqBody: any,
	sendErrorMsg: (msg: string) => void,
	setErrorStatus: (status: number) => void,
	doIfLegal: () => void
) {
	let answer = '';
	let missing = false;
	for (const input of inputs) {
		if (!(input in reqBody)) {
			answer += `\"${input}\", `;
			missing = true;
		}
	}
	if (missing) {
		answer = answer.substring(0, answer.length - 2) + ' not in request.';
		setErrorStatus(400)
		sendErrorMsg(answer);
	} else {
		doIfLegal();
	}
}

app.post('/login', (req, res) => {
	checkInputs(
		['password'],
		req.body,
		(msg: string) => res.send(msg),
		(status) => res.status(status),
		() => {
			authenticator
				.login(req.body['password'])
				.then(response => {
					sendResponse(
						response,
						st => res.status(st),
						msg => res.send(msg)
					);
				})
				.catch(reason => {
					res.status(statusOk);
					res.send(reason);
				});
		}
	);
});

//Guest

app.get('/getItems', (_req, res) => {
	items.getItems().then((items) => res.send(items)).catch(() => {
		res.status(500)
		res.send('Getting items failed, try again later')
	})
});

app.get('/getGuestOrder', (req, res) => {
	authenticate(
		req.headers.authorization,
		1,
		(msg: string) => res.send(msg),
		(status) => res.status(status),
		async (id: string) => {
			const response = await guest.getGuestOrder(id);
			sendResponse(
				response,
				st => res.status(st),
				msg => res.send(msg)
			);
		}
	);
});

app.post('/createOrder', (req, res) => {
	checkInputs(
		['orderItems'],
		req.body,
		(msg: string) => {
			res.status(400)
			res.send(msg)
		},
		(status) => res.status(status),
		() => {
			authenticate(
				req.headers.authorization,
				1,
				(msg: string) => res.send(msg),
				(status) => res.status(status),
				(id: string) => {
					guest
						.createOrder(id, new Map(Object.entries(req.body['orderItems'])))
						.then(response => {
							sendResponse(
								response,
								st => res.status(st),
								(msg) => res.send(msg)
							);
						});
				}
			);
		}
	);
});

app.post('/submitReview', (req, res) => {
	checkInputs(
		['orderId', 'details', 'rating'],
		req.body,
		(msg: string) => res.send(msg),
		(status) => res.status(status),
		() =>
			res.send(
				guest.submitReview(
					req.body['orderId'],
					req.body['details'],
					req.body['rating']
				)
			)
	);
});

app.post('/cancelOrderGuest', (req, res) => {
	checkInputs(
		['orderId'],
		req.body,
		(msg: string) => res.send(msg),
		(status) => res.status(status),
		async () => {
			const response = await guest.cancelOrder(req.body['orderId']);
			sendResponse(
				response,
				st => res.status(st),
				msg => res.send(msg)
			);
		}
	);
});

//waiter

app.get('/getWaiterOrders', (req, res) => {
	authenticate(
		req.headers.authorization,
		2,
		(msg: string) => res.send(msg),
		(status) => res.status(status),
		async (id: string) => {
			const response = await waiter.getWaiterOrders(id);
			sendResponse(
				response,
				st => res.status(st),
				msg => res.send(msg)
			);
		}
	);
});

app.post('/orderArrived', (req, res) => {
	checkInputs(
		['orderId'],
		req.body,
		(msg: string) => res.send(msg),
		(status) => res.status(status),
		async () => {
			const response = await waiter.orderArrived(req.body['orderId']);
			sendResponse(
				response,
				st => res.status(st),
				msg => res.send(msg)
			);
		}
	);
});

app.post('/orderOnTheWay', (req, res) => {
	checkInputs(
		['orderId'],
		req.body,
		(msg: string) => res.send(msg),
		(status) => res.status(status),
		async () => {
			const response = await waiter.orderOnTheWay(req.body['orderId']);
			sendResponse(
				response,
				st => res.status(st),
				msg => res.send(msg)
			); //todo: connect waiter should notify dashboard? add the waiter to waiter list?
		}
	);
});

io.on('connection', function (socket: socketio.Socket) {
	console.log('a user connected');
	authenticate(
		socket.handshake.auth['token'],
		0,
		(msg: string) => {
			socket.emit('Error', msg);
		},
		(_status) => {},
		(id: string) =>
			NotificationInterface.addSubscriber(
				id,
				(eventName: string, o: object) => socket.emit(eventName, o)
			)
	);
	socket.on('updateGuestLocation', (message: any) => {
		checkInputs(
			['mapId', 'location'],
			message,
			(msg: string) => socket.emit('Error', msg),
			(_status) => {},
			() =>
				authenticate(
					socket.handshake.auth['token'],
					1,
					(msg: string) => socket.emit('Error', msg),
					(_status) => {},
					(id: string) =>
						guest.updateLocationGuest(
							id,
							message['mapId'],
							message['location']
						)
				)
		);
	});
	socket.on('updateWaiterLocation', (message: any) => {
		checkInputs(
			['mapId', 'location'],
			message,
			(msg: string) => socket.emit('Error', msg),
			(_status) => {},
			() =>
				authenticate(
					socket.handshake.auth['token'],
					2,
					(msg: string) => socket.emit('Error', msg),
					(_status) => {},
					(id: string) =>
						waiter.updateLocationWaiter(
							id,
							message['mapId'],
							message['location']
						)
				)
		);
	});
});

//Dashboard

app.post('/assignWaiter', (req, res) => {
	checkInputs(
		['orderIds', 'waiterId'],
		req.body,
		(msg: string) => res.send(msg),
		(status) => res.status(status),
		async () => {
			const response = await dashboard.assignWaiter(
				req.body['orderIds'],
				req.body['waiterId']
			);
			sendResponse(
				response,
				st => res.status(st),
				msg => res.send(msg)
			);
		}
	);
});

app.get('/getOrders', (_req, res) => {
	dashboard.getAllOrders().then(response => {
		sendResponse(
			response,
			st => res.status(st),
			msg => res.send(msg)
		);
	});
});

app.get('/getWaiters', (_req, res) => {
	dashboard.getWaiters().then(response => {
		sendResponse(
			response,
			st => res.status(st),
			msg => res.send(msg)
		);
	});
});

app.get('/getWaitersByOrder', (req, res) => {
	checkInputs(
		['orderId'],
		req.query,
		(msg: string) => res.send(msg),
		(status) => res.status(status),
		async () => {
			const response = await dashboard.getWaiterByOrder(
				String(req.query['orderId'])
			);
			sendResponse(
				response,
				st => res.status(st),
				msg => res.send(msg)
			);
		}
	);
});

app.post('/cancelOrderAdmin', (req, res) => {
	checkInputs(
		['orderId'],
		req.body,
		(msg: string) => res.send(msg),
		(status) => res.status(status),
		async () => {
			const response = await dashboard.cancelOrderAdmin(
				req.body['orderId']
			);
			sendResponse(
				response,
				st => res.status(st),
				msg => res.send(msg)
			);
		}
	);
});

app.post('/changeOrderStatus', (req, res) => {
	checkInputs(
		['orderId', 'newStatus'],
		req.body,
		(msg: string) => res.send(msg),
		(status) => res.status(status),
		async () => {
			const response = await dashboard.changeOrderStatus(
				req.body['orderId'],
				req.body['newStatus']
			);
			sendResponse(
				response,
				st => res.status(st),
				msg => res.send(msg)
			);
		}
	);
});

AppDataSource.initialize().then(() => {
	reset_all().then(() => {
		http.listen(PORT, () => {
			console.log(`Server is listening on port ${PORT}`);
		});
	});
});
