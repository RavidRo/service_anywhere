require('dotenv').config();

import express from 'express';
import * as socketio from 'socket.io';

import {ResponseMsg} from '../Response';

import dashboard from '../Interface/DashboardInterface';
import guest from '../Interface/GuestInterface';
import items from '../Interface/ItemsInterface';
import maps from '../Interface/MapsInterface';
import NotificationInterface from '../Interface/NotificationInterface';
import waiter from '../Interface/WaiterInterface';

import authenticator from '../Logic/Authentication/Authenticator';

import {logger} from 'server/Logger';
import {AppDataSource} from '../Data/data-source';
import reset_all from '../Data/test_ResetDatabase';

let cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const statusFail = 400;
app.use(express.json());
app.use(express.static('build'));
app.use(cors({origin: '*', credentials: true}));

import * as http from 'http';
import * as socketIO from 'socket.io';
import GuestInterface from '../Interface/GuestInterface';
import WaiterInterface from '../Interface/WaiterInterface';
import path from 'path';

const httpServer = new http.Server(app);
const io = new socketIO.Server(httpServer, {
	cors: {
		origin: '*',
	},
});

// use it before all route definitions
app.get('/', (_req, res) => {
	res.sendFile(path.join(__dirname, '/build/index.html'));
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
			setErrorStatus(response.getStatusCode());
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
		['password', 'username'],
		req.body,
		(msg: string) => {
			res.send(msg);
			logger.info(
				'A user tried to log in without a password or username'
			);
		},
		status => res.status(status),
		() => {
			authenticator
				.login(req.body['username'], req.body['password'])
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

app.get('/getMaps', (_req, res) => {
	maps.getMaps()
		.then(maps => res.send(maps))
		.catch(() => {
			res.status(500);
			res.send('Getting maps failed, try again later');
			logger.error('An error occured while getting maps data');
		});
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
		['orderID', 'details', 'rating'],
		req.body,
		(msg: string) => res.send(msg),
		status => res.status(status),
		() =>
			res.send(
				guest.submitReview(
					req.body['orderID'],
					req.body['details'],
					req.body['rating']
				)
			)
	);
});

app.post('/cancelOrderGuest', (req, res) => {
	checkInputs(
		['orderID'],
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
				async guestID => {
					const response = await guest.cancelOrder(
						req.body['orderID'],
						guestID
					);
					sendResponse(
						response,
						st => res.status(st),
						msg => res.send(msg)
					);
					if (response.isSuccess()) {
						logger.info(
							'A guest canceled their order. Order ID: ' +
								req.body['orderID']
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
		req.query,
		(msg: string) => {
			res.send(msg);
			logger.info(
				'A waiter tried to get a guest details but gave no id list'
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
						'A user tried to get a guest details but had no permission or used an unmatched token'
					);
				},
				status => res.status(status),
				async _waiterID => {
					const ids = req.query['ids'];
					if (ids && Array.isArray(ids) && isStringArray(ids)) {
						const response = await waiter
							.getGuestsDetails(ids)
							.then(guests => res.send(guests))
							.catch(() => {
								res.status(500);
								res.send(
									'Getting guests failed, try again later'
								);
								logger.error(
									'An error occured while getting guests data'
								);
							});
					} else {
						res.status(400);
						res.send(
							'Getting guests failed, the ids given were the wrong type'
						);
						logger.info(
							'A user tried to get guests details but gave the list of ids in the wrong type'
						);
					}
				}
			);
		}
	);
});

function isStringArray(arr: any): arr is string[] {
	return arr.every((val: any) => typeof val === 'string');
}

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
		['orderID'],
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
				async waiterID => {
					const response = await waiter.orderArrived(
						req.body['orderID'],
						waiterID
					);
					sendResponse(
						response,
						st => res.status(st),
						msg => res.send(msg)
					);
					if (response.isSuccess()) {
						logger.info(
							"A waiter changes order status to 'arrived'. Order ID: " +
								req.body['orderID']
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
		['orderID'],
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
				async waiterID => {
					const response = await waiter.orderOnTheWay(
						req.body['orderID'],
						waiterID
					);
					sendResponse(
						response,
						st => res.status(st),
						msg => res.send(msg)
					); //todo: connect waiter should notify dashboard? add the waiter to waiter list?
					if (response.isSuccess()) {
						logger.info(
							"Order status was changed to 'on the way'. Order ID: " +
								req.body['orderID']
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
				'A waiter tried to get their name but had no permission or used an unmatched token'
			);
		},
		status => res.status(status),
		async waiterID => {
			const response = await waiter.getWaiterName(waiterID);
			sendResponse(
				response,
				st => res.status(st),
				msg => res.send(msg)
			);
			if (!response.isSuccess()) {
				logger.info(
					'A waiter failed to get their name. Error: ' +
						response.getError()
				);
			}
		}
	);
});

io.on('connection', function (socket: socketio.Socket) {
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
			['location'],
			message,
			(msg: string) => {
				socket.emit('Error', msg);
				logger.info(
					"A user tried to update a guest's location but didn't include the location"
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
					(id: string) => {
						//console.debug('guest updates location: ', message);
						guest.updateLocationGuest(id, message['location']);
					}
				)
		);
	});
	socket.on('updateWaiterLocation', (message: any) => {
		checkInputs(
			['location'],
			message,
			(msg: string) => {
				socket.emit('Error', msg);
				logger.info(
					"A user tried to update a waiter's location but didn't include the location"
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
					(id: string) => {
						//console.debug('waiter updates location: ', message);
						waiter.updateLocationWaiter(id, message['location']);
					}
				)
		);
	});
	socket.on('locationErrorGuest', (message: any) => {
		checkInputs(
			['errorMsg'],
			message,
			(msg: string) => {
				socket.emit('Error', msg);
				logger.info(
					"A user tried to send an error regarding their location and didn't include an error message."
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
							'A user tried to send an error regarding their location but used an unmatched token'
						);
					},
					_status => {},
					(id: string) => {
						GuestInterface.locationErrorGuest(
							id,
							message['errorMsg']
						);
					}
				)
		);
	});
	socket.on('locationErrorWaiter', (message: any) => {
		checkInputs(
			['errorMsg'],
			message,
			(msg: string) => {
				socket.emit('Error', msg);
				logger.info(
					"A user tried to send an error regarding their location and didn't include an error message."
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
							'A user tried to send an error regarding their location but used an unmatched token'
						);
					},
					_status => {},
					(id: string) => {
						WaiterInterface.locationErrorWaiter(
							message['errorMsg'],
							id
						);
					}
				)
		);
	});
});

//Dashboard

app.post('/assignWaiter', (req, res) => {
	checkInputs(
		['orderID', 'waiterIDs'],
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
						req.body['orderID'],
						req.body['waiterIDs']
					);
					sendResponse(
						response,
						st => res.status(st),
						msg => res.send(msg)
					);
					if (response.isSuccess()) {
						logger.info(
							'A waiter was assigned successfuly. Waiter ID: ' +
								req.body['waiterIDs'] +
								' Order IDs: ' +
								req.body['orderID']
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
		['orderID'],
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
						String(req.query['orderID'])
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

app.get('/getReviews', (req, res) => {
	authenticate(
		req.headers.authorization,
		3,
		(msg: string) => {
			res.send(msg);
			logger.info(
				'A user tried to get reviews but did not have permission or used an unmatched token'
			);
		},
		status => res.status(status),
		async _id => {
			const response = await dashboard.getReviews();
			res.send(response);
		}
	);
});

app.post('/cancelOrderAdmin', (req, res) => {
	checkInputs(
		['orderID'],
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
						req.body['orderID'],
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
		['orderID', 'newStatus'],
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
						req.body['orderID'],
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
