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
import {logger} from 'server/Logger';

let cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const statusFail = 400;
app.use(express.json());
app.use(cors({origin: '*', credentials: true}));

import * as http from 'http';
import * as socketIO from 'socket.io';

const httpServer = new http.Server(app);
const io = new socketIO.Server(httpServer, {
	cors: {
		origin: '*',
	},
});

// use it before all route definitions

app.get('/', (_req, res) => {
	res.send("Ima shel Tommer ve'aba shel Tommer");
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
			setErrorStatus(statusFail);
			sendErrorMsg(response.getError());
		}
	} else {
		setErrorStatus(statusFail);
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
		setErrorStatus(statusFail);
		sendErrorMsg(answer);
	} else {
		doIfLegal();
	}
}

app.post('/login', (req, res) => {
	checkInputs(
		['password'],
		req.body,
		(msg: string) => {
			res.send(msg);
			logger.info('A user tried to log in without a password');
		},
		status => res.status(status),
		() => {
			authenticator
				.login(req.body['password'])
				.then(response => {
					sendResponse(
						response,
						st => res.status(st),
						msg => res.send(msg)
					);
					if (response.isSuccess()) {
						logger.info('A user connected successfully');
					} else {
						logger.info(
							'A user failed to connect (wrong password)'
						);
					}
				})
				.catch(reason => {
					res.status(statusFail);
					res.send(reason);
					logger.error(
						'An unknown error occured during user data retreival'
					);
				});
		}
	);
});

//Guest

app.get('/getItems', (_req, res) => {
	items
		.getItems()
		.then(items => res.send(items))
		.catch(() => {
			res.status(500);
			res.send('Getting items failed, try again later');
			logger.error('An error occured while getting items data');
		});
});

app.get('/getGuestOrder', (req, res) => {
	authenticate(
		req.headers.authorization,
		1,
		(msg: string) => {
			res.send(msg);
			logger.info(
				"A user tried to get a guest's active order but used an unmatched token"
			);
		},
		status => res.status(status),
		async (id: string) => {
			const response = await guest.getGuestOrder(id);
			sendResponse(
				response,
				st => res.status(st),
				msg => res.send(msg)
			);
			if (!response.isSuccess()) {
				logger.info(
					'A guest failed to get their active order. Error: ' +
						response.getError()
				);
			}
		}
	);
});

app.post('/createOrder', (req, res) => {
	checkInputs(
		['orderItems'],
		req.body,
		(msg: string) => {
			res.status(statusFail);
			res.send(msg);
			logger.info(
				"A guest tried to create an order but didn't enter items"
			);
		},
		status => res.status(status),
		() => {
			authenticate(
				req.headers.authorization,
				1,
				(msg: string) => {
					res.send(msg);
					logger.info(
						'A guest tried to create an order with an unmatched token'
					);
				},
				status => res.status(status),
				(id: string) => {
					guest
						.createOrder(
							id,
							new Map(Object.entries(req.body['orderItems']))
						)
						.then(response => {
							sendResponse(
								response,
								st => res.status(st),
								msg => res.send(msg)
							);
							if (response.isSuccess()) {
								logger.info(
									'A guest created a new order. Order ID: ' +
										response.getData()
								);
							} else {
								logger.info(
									'A guest could not create a new order. Error: ' +
										response.getError()
								);
							}
						})
						.catch(e =>
							logger.error(
								'An error occured while trying to save the new order: ' +
									e
							)
						);
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
		status => res.status(status),
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
		(msg: string) => {
			res.send(msg);
			logger.info(
				'A guest tried to cancel their order but did not enter order ID'
			);
		},
		status => res.status(status),
		async () => {
			authenticate(
				req.headers.authorization,
				1,
				(msg: string) => {
					res.send(msg);
					logger.info(
						'A guest tried to cancel their order but used an unmatched token'
					);
				},
				status => res.status(status),
				async guestId => {
					const response = await guest.cancelOrder(
						req.body['orderId'],
						guestId
					);
					sendResponse(
						response,
						st => res.status(st),
						msg => res.send(msg)
					);
					if (response.isSuccess()) {
						logger.info(
							'A guest canceled their order. Order ID: ' +
								req.body['orderId']
						);
					} else {
						logger.info(
							'A guest failed to cancel their order. Error: ' +
								response.getError()
						);
					}
				}
			);
		}
	);
});

//waiter

app.get('/getGuestsDetails', (req, res) => {
	checkInputs(
		['ids'],
		req.body,
		(msg: string) => {
			res.send(msg);
			logger.info(
				"A waiter tried to get a guest details but gave no id list"
			);
		},
		status => res.status(status),
		async () => {
			authenticate(
				req.headers.authorization,
				2,
				(msg: string) => {
					res.send(msg);
					logger.info(
						"A user tried to get a guest details but had no permission or used an unmatched token"
					);
				},
				status => res.status(status),
				async _waiterId => {
					const response = await waiter.getGuestsDetails(
						req.body['ids']
					).then(guests => res.send(guests))
					.catch(() => {
						res.status(500);
						res.send('Getting guests failed, try again later');
						logger.error('An error occured while getting guests data');
					});
				}
			);
		}
	);
});


app.get('/getWaiterOrders', (req, res) => {
	authenticate(
		req.headers.authorization,
		2,
		(msg: string) => {
			res.send(msg);
			logger.info(
				"A user tried to watch a waiter's orders without permission or with an unmatched token"
			);
		},
		status => res.status(status),
		async (id: string) => {
			const response = await waiter.getWaiterOrders(id);
			sendResponse(
				response,
				st => res.status(st),
				msg => res.send(msg)
			);
			if (!response.isSuccess()) {
				logger.info(
					"A user failed to get a waiter's order. Error: " +
						response.getError()
				);
			}
		}
	);
});

app.post('/orderArrived', (req, res) => {
	checkInputs(
		['orderId'],
		req.body,
		(msg: string) => {
			res.send(msg);
			logger.info(
				"A waiter tried to change order status to 'arrived' and didn't give an order ID"
			);
		},
		status => res.status(status),
		async () => {
			authenticate(
				req.headers.authorization,
				2,
				(msg: string) => {
					res.send(msg);
					logger.info(
						"A user tried to change order status to 'arrived' but had no permission or used an unmatched token"
					);
				},
				status => res.status(status),
				async waiterId => {
					const response = await waiter.orderArrived(
						req.body['orderId'],
						waiterId
					);
					sendResponse(
						response,
						st => res.status(st),
						msg => res.send(msg)
					);
					if (response.isSuccess()) {
						logger.info(
							"A waiter changes order status to 'arrived'. Order ID: " +
								req.body['orderId']
						);
					} else {
						logger.info(
							"A waiter failed to change order status to 'arrived'. Error: " +
								response.getError()
						);
					}
				}
			);
		}
	);
});

app.post('/orderOnTheWay', (req, res) => {
	checkInputs(
		['orderId'],
		req.body,
		(msg: string) => {
			res.send(msg);
			logger.info(
				"A waiter tried to change order status to 'on the way' and didn't give an order ID"
			);
		},
		status => res.status(status),
		async () => {
			authenticate(
				req.headers.authorization,
				2,
				(msg: string) => {
					res.send(msg);
					logger.info(
						"A waiter tried to change order status to 'on the way' but had no permission or used an unmatched token"
					);
				},
				status => res.status(status),
				async waiterId => {
					const response = await waiter.orderOnTheWay(
						req.body['orderId'],
						waiterId
					);
					sendResponse(
						response,
						st => res.status(st),
						msg => res.send(msg)
					); //todo: connect waiter should notify dashboard? add the waiter to waiter list?
					if (response.isSuccess()) {
						logger.info(
							"Order status was changed to 'on the way'. Order ID: " +
								req.body['orderId']
						);
					} else {
						logger.info(
							"A waiter failed to change order status to 'on the way'. Error: " +
								response.getError()
						);
					}
				}
			);
		}
	);
});

app.get('/getWaiterName', (req, res) => {
	authenticate(
		req.headers.authorization,
		2,
		(msg: string) => {
			res.send(msg);
			logger.info(
				"A waiter tried to get their name but had no permission or used an unmatched token"
			);
		},
		status => res.status(status),
		async waiterId => {
			const response = await waiter.getWaiterName(waiterId);
			sendResponse(
				response,
				st => res.status(st),
				msg => res.send(msg)
			);
			if (!response.isSuccess()) {
				logger.info(
					"A waiter failed to get their name. Error: " +
						response.getError()
				);
			}
		}
	);
});

io.on('connection', function (socket: socketio.Socket) {
	console.debug('a user connected');
	authenticate(
		socket.handshake.auth['token'],
		0,
		(msg: string) => {
			socket.emit('Error', msg);
			logger.error('Could not connect a user to the websocket');
		},
		_status => {},
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
			(msg: string) => {
				socket.emit('Error', msg);
				logger.info(
					"A user tried to update a guest's location but didn't include the map ID or the location"
				);
			},
			_status => {},
			() =>
				authenticate(
					socket.handshake.auth['token'],
					1,
					(msg: string) => {
						socket.emit('Error', msg);
						logger.info(
							"A user tried to update a guest's location but used an unmatched token"
						);
					},
					_status => {},
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
			(msg: string) => {
				socket.emit('Error', msg);
				logger.info(
					"A user tried to update a waiter's location but didn't include the map ID or the location"
				);
			},
			_status => {},
			() =>
				authenticate(
					socket.handshake.auth['token'],
					2,
					(msg: string) => {
						socket.emit('Error', msg);
						logger.info(
							"A user tried to update a guest's location but used an unmatched token or has no permission"
						);
					},
					_status => {},
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
		(msg: string) => {
			res.send(msg);
			logger.info(
				"A user tried to assign a waiter but didn't include order IDs or waiter ID"
			);
		},
		status => res.status(status),
		async () => {
			authenticate(
				req.headers.authorization,
				3,
				(msg: string) => {
					res.send(msg);
					logger.info(
						'A user tried to assign a waiter but had no permission or used an unmatched token'
					);
				},
				status => res.status(status),
				async _adminId => {
					const response = await dashboard.assignWaiter(
						req.body['orderIds'],
						req.body['waiterId']
					);
					sendResponse(
						response,
						st => res.status(st),
						msg => res.send(msg)
					);
					if (response.isSuccess()) {
						logger.info(
							'A waiter was assigned successfuly. Waiter ID: ' +
								req.body['waiterId'] +
								' Order IDs: ' +
								req.body['orderIds']
						);
					} else {
						logger.info(
							'A waiter could not be assigned. Error: ' +
								response.getError()
						);
					}
				}
			);
		}
	);
});

app.get('/getOrders', (req, res) => {
	authenticate(
		req.headers.authorization,
		3,
		(msg: string) => {
			res.send(msg);
			logger.info(
				'A user tried to get all orders but has no permission or used an unmatched token'
			);
		},
		status => res.status(status),
		_id => {
			dashboard.getAllOrders().then(response => {
				sendResponse(
					response,
					st => res.status(st),
					msg => res.send(msg)
				);
				if (!response.isSuccess()) {
					logger.info(
						'Admin could not get orders. Error: ' +
							response.getError()
					);
				}
			});
		}
	);
});

app.get('/getWaiters', (req, res) => {
	authenticate(
		req.headers.authorization,
		3,
		(msg: string) => {
			res.send(msg);
			logger.info(
				'A user tried to get all orders but has no permission or used an unmatched token'
			);
		},
		status => res.status(status),
		_id => {
			dashboard.getWaiters().then(response => {
				sendResponse(
					response,
					st => res.status(st),
					msg => res.send(msg)
				);
				if (!response.isSuccess()) {
					logger.info(
						'Admin could not get waiters. Error: ' +
							response.getError()
					);
				}
			});
		}
	);
});

app.get('/getWaitersByOrder', (req, res) => {
	checkInputs(
		['orderId'],
		req.query,
		(msg: string) => {
			res.send(msg);
			logger.info(
				'A user tried to get waiters by order but did not include an order ID'
			);
		},
		status => res.status(status),
		async () => {
			authenticate(
				req.headers.authorization,
				3,
				(msg: string) => {
					res.send(msg);
					logger.info(
						'A user tried to get waiters by order but did not have permission or used an unmatched token'
					);
				},
				status => res.status(status),
				async _id => {
					const response = await dashboard.getWaiterByOrder(
						String(req.query['orderId'])
					);
					sendResponse(
						response,
						st => res.status(st),
						msg => res.send(msg)
					);
					if (!response.isSuccess()) {
						logger.info(
							'Admin could not get waiters by order. Error: ' +
								response.getError()
						);
					}
				}
			);
		}
	);
});

app.post('/cancelOrderAdmin', (req, res) => {
	checkInputs(
		['orderId'],
		req.body,
		(msg: string) => {
			res.send(msg);
			logger.info(
				'A user tried to cancel an order but did not include an order ID'
			);
		},
		status => res.status(status),
		async () => {
			authenticate(
				req.headers.authorization,
				3,
				(msg: string) => {
					res.send(msg);
					logger.info(
						'A user tried to cancel an order but did not have permission or used an unmatched token'
					);
				},
				status => res.status(status),
				async id => {
					const response = await dashboard.cancelOrderAdmin(
						req.body['orderId'],
						id
					);
					sendResponse(
						response,
						st => res.status(st),
						msg => res.send(msg)
					);
					if (!response.isSuccess()) {
						logger.info(
							'Admin could not cancel order. Error: ' +
								response.getError()
						);
					}
				}
			);
		}
	);
});

app.post('/changeOrderStatus', (req, res) => {
	checkInputs(
		['orderId', 'newStatus'],
		req.body,
		(msg: string) => {
			res.send(msg);
			logger.info(
				'A user tried to change order status but did not include an order ID or a new status'
			);
		},
		status => res.status(status),
		async () => {
			authenticate(
				req.headers.authorization,
				3,
				(msg: string) => {
					res.send(msg);
					logger.info(
						'A user tried to change order status but did not have permission or used an unmatched token'
					);
				},
				status => res.status(status),
				async id => {
					const response = await dashboard.changeOrderStatus(
						req.body['orderId'],
						req.body['newStatus'],
						id
					);
					sendResponse(
						response,
						st => res.status(st),
						msg => res.send(msg)
					);
					if (!response.isSuccess()) {
						logger.info(
							'Admin could not cancel order. Error: ' +
								response.getError()
						);
					}
				}
			);
		}
	);
});

AppDataSource.initialize().then(() => {
	reset_all().then(() => {
		httpServer.listen(PORT, () => {
			console.log(`Server is listening on port ${PORT}`);
		});
	});
});
