import express from 'express';
import guest from '../Interface/GuestInterface';
import dashboard from '../Interface/DashboardInterface';
import waiter from '../Interface/WaiterInterface';
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
		() => res.send(guest.login(req.body['phoneNumber']))
	);
});

app.get('/getItems', (req, res) => {
	res.send(guest.getItems());
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

app.post('/cancelOrder', (req, res) => {
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
});

//Dashboard
app.get('/getOrders', (_req, res) => {
	res.send(dashboard.getOrders());
});

app.post('/assignWaiter', (req, res) => {
	checkInputs(
		['orderID', 'waiterID'],
		req.body,
		(msg: string) => res.send(msg),
		() =>
			res.send(
				dashboard.assignWaiter(
					req.body['orderID'],
					req.body['waiterID']
				)
			)
	);
});

app.get('/getWaiters', (_req, res) => {
	res.send(dashboard.getWaiters());
});

app.get('/getWaitersByOrder', (req, res) => {
	checkInputs(
		['orderID'],
		req.query,
		(msg: string) => res.send(msg),
		() => res.send(dashboard.getWaiterByOrder(String(req.query['orderID'])))
	);
});

//waiter
app.get('/getWaiterOrders', (req, res) => {
	checkInputs(
		['waiterID'],
		req.query,
		(msg: string) => res.send(msg),
		() => res.send(waiter.getWaiterOrder(String(req.query['waiterID'])))
	);
});

app.get('/getGuestLocation', (req, res) => {	//todo: delete this
	checkInputs(
		['orderID'],
		req.query,
		(msg: string) => res.send(msg),
		() => res.send(waiter.getGuestLocation(String(req.query['orderID'])))
	);
});

app.post('/orderArrived', (req, res) => {
	checkInputs(
		['orderID'],
		req.body,
		(msg: string) => res.send(msg),
		() => res.send(waiter.orderArrived(req.body['orderID']))
	);
});

app.post('/connectWaiter', (_req, res) => {
	res.send(waiter.connectWaiter());
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

http.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
