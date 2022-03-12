import express from 'express';
import guest from '../Interface/GuestInterface';
import dashboard from '../Interface/DashboardInterface';
import waiter from '../Interface/WaiterInterface';
import items from '../Interface/ItemsInterface';
import * as socketio from 'socket.io';
import * as path from 'path';

var cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
var http = require('http').Server(app);
var sockets: socketio.Socket[] = [];
var socketToken = new Map<socketio.Socket, string>();
let io = require('socket.io')(http);

// use it before all route definitions
app.use(cors({origin: '*'}));

app.get('/', (_req, res) => {	//todo: maybe something else
	res.send('Hello World!');
});

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

//Guest
app.get('/loginGuest', (req, res) => {
	checkInputs(
		['phoneNumber'],
		req.body,
		(msg: string) => res.send(msg),
		() => res.send(guest.login(req.body['phoneNumber']))	//todo: get from authenticator
	);
});

app.get('/getItemsGuest', (req, res) => {
	res.send(items.getItems());
});

app.get('/getGuestOrder', (req, res) => {
	res.send(guest.getGuestOrder(req.headers.authorization))	//todo: authenticator pre function
});

app.post('/createOrder', (req, res) => {
	checkInputs(
		['orderItems'],
		req.body,
		(msg: string) => res.send(msg),
		() => res.send(guest.createOrder(req.body['orderItems']))
	);
});

app.post('/submitReview', (req, res) => {
	checkInputs(
		['orderId', 'details', 'rating'],
		req.body,
		(msg: string) => res.send(msg),
		() => res.send(guest.submitReview(req.body['orderId'], req.body['details'], req.body['rating']))
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

app.post('/updateGuestLocation', (req, res) => {
	checkInputs(
		['guestLocation'],
		req.body,
		(msg: string) => res.send(msg),
		() => res.send(guest.updateLocationGuest(req.body['guestLocation']))
	);
});	//todo: make socket call

//waiter
app.get('/loginWaiter', (req, res) => {
	checkInputs(
		['password'],
		req.body,
		(msg: string) => res.send(msg),
		() => res.send(waiter.login(req.body['password']))
	);
});

app.get('/getItemsWaiter', (req, res) => {
	res.send(waiter.getItems());
});

app.get('/getWaiterOrders', (req, res) => {
	res.send(guest.getWaiterOrders(req.headers.authorization))
});

app.get('/getGuestLocation', (req, res) => {	//todo: delete this
	checkInputs(
		['orderID'],
		req.query,
		(msg: string) => res.send(msg),
		() => res.send(waiter.getGuestLocation(String(req.query['orderID'])))
		);
});	//todo: make socket

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
		() => res.send(waiter.orderOnTheWay(req.body['orderId']))
		);
});

io.on('connection', function (socket: socketio.Socket) {
	console.log('a user connected');
	sockets.push(socket);
	socket.on('updateGuestLocation', (message: any) => {
		guest.updateLocationGuest(
			message['location'],
			socket.handshake.auth['token']
		);
	});
	socket.on('updateWaiterLocation', (message: any) => {
		waiter.updateLocationWaiter(
			socket.handshake.auth['token'],
			message['map'],
			message['location']
		);
	});
});

//Dashboard
app.get('/loginAdmin', (req, res) => {
	checkInputs(
		['password'],
		req.body,
		(msg: string) => res.send(msg),
		() => res.send(dashboard.loginAdmin(req.body['password']))
	);
});

app.post('/assignWaiter', (req, res) => {
	checkInputs(
		['orderIds', 'waiterId'],
		req.body,
		(msg: string) => res.send(msg),
		() =>
			res.send(
				dashboard.assignWaiter(
					req.body['orderIds'],
					req.body['waiterId']
				)
			)
	);
});

app.get('/getOrders', (_req, res) => {
	res.send(dashboard.getOrders());
});

app.get('/getWaiters', (_req, res) => {
	res.send(dashboard.getWaiters());
});

app.get('/getWaitersByOrder', (req, res) => {
	checkInputs(
		['orderId'],
		req.query,
		(msg: string) => res.send(msg),
		() => res.send(dashboard.getWaiterByOrder(String(req.query['orderId'])))
	);
});

app.post('/cancelOrderAdmin', (req, res) => {
	checkInputs(
		['orderId'],
		req.body,
		(msg: string) => res.send(msg),
		() =>
			res.send(
				dashboard.cancelOrderAdmin(
					req.body['orderId']
				)
			)
	);
});

app.post('/changeOrderStatus', (req, res) => {
	checkInputs(
		['orderId', 'newStatus'],
		req.body,
		(msg: string) => res.send(msg),
		() =>
			res.send(
				dashboard.changeOrderStatus(
					req.body['orderId'],
					req.body['newStatus']
				)
			)
	);
});

http.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
