import express from 'express';
import guest from '../Interface/GuestInterface';
import dashboard from '../Interface/DashboardInterface';
import waiter from '../Interface/WaiterInterface';
import items from '../Interface/ItemsInterface';
import * as socketio from 'socket.io';
import * as path from 'path';
import authenticator from '../Logic/Authentication/Authenticator';
import NotificationInterface from 'server/Interface/NotificationInterface';
import { responseStatus } from 'server/Interface/ResponseStatus';

let cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
let http = require('http').Server(app);
let io = require('socket.io')(http);

// use it before all route definitions
app.use(cors({origin: '*'}));

app.get('/', (_req, res) => {
	res.send('Hello World!');
});
//todo: check for responseMsg handling and move those if needed
function authenticate(
	token: string | undefined,
	permissionLevel: number,
	sendErrorMsg: (msg: string) => void,
	doIfLegal: (id: string) => void
) {
	if (token) {
		let response = authenticator.authenticate(token, permissionLevel);
		if (response.isSuccess()) {
			response.then(doIfLegal);
		} else {
			sendErrorMsg(response.getData());
		}
	} else {
		sendErrorMsg('Token does not match any id');
	}
}

function sendResponse(response: responseStatus, res){	//todo: res type
	res.status(response.status)
	res.send(response.response)
}

function checkInputs(
	inputs: string[],
	reqBody: any,
	sendErrorMsg: (msg: string) => void,
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
		sendErrorMsg(answer);
	} else {
		doIfLegal();
	}
}

app.get('/login', (req, res) => {
	checkInputs(
		['password'],
		req.body,
		(msg: string) => res.send(msg),
		() => res.send(authenticator.login(req.body['password']))
	);
});

//Guest

app.get('/getItemsGuest', (_req, res) => {
	res.send(items.getItems());
});

app.get('/getGuestOrder', (req, res) => {
	authenticate(
		req.headers.authorization,
		1,
		(msg: string) => res.send(msg),
		(id: string) => res.send(guest.getGuestOrder(id))
	);
});

app.post('/createOrder', (req, res) => {
	checkInputs(
		['orderItems'],
		req.body,
		(msg: string) => res.send(msg),
		() => {
			authenticate(
				req.headers.authorization,
				1,
				(msg: string) => res.send(msg),
				(id: string) =>
					res.send(guest.createOrder(id, req.body['orderItems']))	//todo: change response type
			);
		}
	);
});

app.post('/submitReview', (req, res) => {
	checkInputs(
		['orderId', 'details', 'rating'],
		req.body,
		(msg: string) => res.send(msg),
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
		() => res.send(guest.cancelOrder(req.body['orderId']))
	);
});

//waiter

app.get('/getItemsWaiter', (_req, res) => {
	res.send(items.getItems());
});

app.get('/getWaiterOrders', (req, res) => {
	authenticate(
		req.headers.authorization,
		2,
		(msg: string) => res.send(msg),
		(id: string) => res.send(waiter.getWaiterOrders(id))
	);
});

app.post('/orderArrived', (req, res) => {
	checkInputs(
		['orderId'],
		req.body,
		(msg: string) => res.send(msg),
		() => res.send(waiter.orderArrived(req.body['orderId']))
	);
});

app.post('/orderOnTheWay', (req, res) => {
	checkInputs(
		['orderId'],
		req.body,
		(msg: string) => res.send(msg),
		() => res.send(waiter.orderOnTheWay(req.body['orderId']))	//todo: connect waiter should notify dashboard?
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
			() =>
				authenticate(
					socket.handshake.auth['token'],
					1,
					(msg: string) => socket.emit('Error', msg),
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
			() =>
				authenticate(
					socket.handshake.auth['token'],
					2,
					(msg: string) => socket.emit('Error', msg),
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
		() =>{
			let response = dashboard.assignWaiter(req.body['orderIds'], req.body['waiterId'])
			sendResponse(response, res)
		}
	);
});

app.get('/getOrders', (_req, res) => {
	let response = dashboard.getOrders()
	sendResponse(response, res)
});

app.get('/getWaiters', (_req, res) => {
	res.send(dashboard.getWaiters());
});

app.get('/getWaitersByOrder', (req, res) => {
	checkInputs(
		['orderId'],
		req.query,
		(msg: string) => res.send(msg),
		() => {
			let response = dashboard.getWaiterByOrder(String(req.query['orderId']))
			sendResponse(response, res)
		}
	);
});

app.post('/cancelOrderAdmin', (req, res) => {
	checkInputs(
		['orderId'],
		req.body,
		(msg: string) => res.send(msg),
		() => {
			let response = dashboard.cancelOrderAdmin(req.body['orderId'])
			sendResponse(response, res)
		}
	);
});

app.post('/changeOrderStatus', (req, res) => {
	checkInputs(
		['orderId', 'newStatus'],
		req.body,
		(msg: string) => res.send(msg),
		() => {
			let response = dashboard.changeOrderStatus(req.body['orderId'], req.body['newStatus'])
			sendResponse(response, res)
		}
	);
});

http.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
