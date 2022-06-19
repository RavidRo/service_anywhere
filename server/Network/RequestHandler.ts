require('dotenv').config();
import express, { response } from 'express';
import * as http from 'http';
import { logger } from 'server/Logger';
import * as socketio from 'socket.io';

import {makeFail, makeGood, ResponseMsg} from '../Response';

import dashboard from '../Interface/DashboardInterface';
import guest from '../Interface/GuestInterface';
import items from '../Interface/ItemsInterface';
import maps from '../Interface/MapsInterface';
import NotificationInterface from '../Interface/NotificationInterface';
import waiter from '../Interface/WaiterInterface';

import authenticator from '../Logic/Authentication/Authenticator';

import {AppDataSource} from '../Data/data-source';
import reset_all from '../Data/test_ResetDatabase';

let cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const statusFailClient = 400;
const statusFailServer = 500;
const adminPermissionLevel = 3;
const waiterPermissionLevel = 2;
const guestPermissionLevel = 1;
app.use(express.json());
app.use(express.static('build'));
app.use(cors({origin: '*', credentials: true}));

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

//---------------auxillary functions----------------

/**
 * used for checking if the token received is a valid token, if the user has the permission to perform
 * requested action and to extract the user's ID from the token.
 * 
 * @param token The user's token
 * @param permissionLevel Minimum permission level needed for the request
 * @param sendErrorMsg If any requirement is not met, invoke method with the error msg and status code to send it to the client
 * @param doIfLegal If all requirements are met, invoke method with the ID extracted to perform the action requested
 */
function checkValidity(
	inputs: string[],
	reqBody: any,
	sendErrorMsg: (msg: string, status: number) => void,
	toAuthenticate: boolean = false,
	token?: string | undefined,
	permissionLevel: number = guestPermissionLevel
): ResponseMsg<string> {
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
		sendErrorMsg(answer, statusFailClient);
		return makeFail(answer)
	} else if(toAuthenticate){
		if (token) {
			let response = authenticator.authenticate(token, permissionLevel);
			if (response.isSuccess()) {
				return response
			} else {
				sendErrorMsg(response.getError(), statusFailClient);
				return makeFail('')
			}
		} else {
			sendErrorMsg('Token does not match any id', statusFailClient);
			return makeFail('')
		}
	}
	else{
		return makeGood('')
	}
}

/**
 * used for sending the response data if succeded or error message if not
 * 
 * @param response The action's response
 * @param setStatus Used to set the status for the response sent to client
 * @param send Used to send the response to client
 */
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

//---------------general requests---------------------
app.post('/login', (req, res) => {
	const response = checkValidity(
		['password', 'username'],
		req.body,
		(msg: string, status: number) => {
			res.status(status)
			res.send(msg);
			logger.info(
				'A user tried to log in without a password or username'
			);
		}
	)
	response.ifGood((_) => {
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
					res.status(statusFailClient);
					res.send(reason);
					logger.error(
						'An unknown error occured during user data retreival'
					);
				});
		})
});

app.get('/getMaps', (_req, res) => {
	maps.getMaps()
		.then(maps => res.send(maps))
		.catch(() => {
			res.status(statusFailServer);
			res.send('Getting maps failed, try again later');
			logger.error('An error occured while getting maps data');
		});
});

//---------------------Guest requests----------------------------

app.get('/getItems', (_req, res) => {
	items
		.getItems()
		.then(items => res.send(items))
		.catch(() => {
			res.status(statusFailServer);
			res.send('Getting items failed, try again later');
			logger.error('An error occured while getting items data');
		});
});

app.get('/getGuestOrder', (req, res) => {
	const response = checkValidity(
		[],
		req.body,
		(msg: string, status: number) => {
			res.status(status)
			res.send(msg);
			logger.info(
				"A user tried to get a guest's active order but used an unmatched token"
			);
		},
		true,
		req.headers.authorization
	)
	response.ifGood(async (id: string) => {
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
		})
});

app.post('/createOrder', (req, res) => {
	const response = checkValidity(
		['orderItems'],
		req.body,
		(msg: string, status: number) => {
			res.status(status)
			res.status(statusFailClient);
			res.send(msg);
			logger.info(
				"A guest tried to create an order but didn't enter items"
			);
		},
		true,
		req.headers.authorization
	);
	response.ifGood(
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
	)
});

app.post('/submitReview', (req, res) => {
	const response = checkValidity(
		['orderID', 'details', 'rating'],
		req.body,
		(msg: string, status: number) =>{ 
			res.status(status)
			res.send(msg)
		}
	);
	response.ifGood((_) =>
		res.send(
			guest.submitReview(
				req.body['orderID'],
				req.body['details'],
				req.body['rating']
			)
		))
});

app.post('/cancelOrderGuest', (req, res) => {
	const response = checkValidity(
		['orderID'],
		req.body,
		(msg: string, status: number) => {
			res.status(status)
			res.send(msg);
			logger.info(
				'A guest tried to cancel their order but did not enter order ID'
			);
		},
		true,
		req.headers.authorization
	);
	response.ifGood(async guestID => {
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
	})
});

//---------------waiter requests--------------------

app.get('/getGuestsDetails', (req, res) => {
	const response = checkValidity(
		['ids'],
		req.query,
		(msg: string, status: number) => {
			res.status(status)
			res.send(msg);
			logger.info(
				'A waiter tried to get a guest details but gave no id list'
			);
		},
		true,
		req.headers.authorization
	);
	response.ifGood(async _waiterID => {
		const ids = req.query['ids'];
		if (ids && Array.isArray(ids) && isStringArray(ids)) {
			const response = await waiter
				.getGuestsDetails(ids)
				.then(guests => res.send(guests))
				.catch(() => {
					res.status(statusFailServer);
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
	})
});

function isStringArray(arr: any): arr is string[] {
	return arr.every((val: any) => typeof val === 'string');
}

app.get('/getWaiterOrders', (req, res) => {
	const response = checkValidity(
		[],
		req.body,
		(msg: string, status: number) => {
			res.status(status)
			res.send(msg);
			logger.info(
				"A user tried to watch a waiter's orders without permission or with an unmatched token"
			);
		},
		true,
		req.headers.authorization,
		waiterPermissionLevel
	)
	response.ifGood(
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
	)
});

app.post('/orderArrived', (req, res) => {
	const response = checkValidity(
		['orderID'],
		req.body,
		(msg: string, status: number) => {
			res.status(status)
			res.send(msg);
			logger.info(
				"A waiter tried to change order status to 'arrived' and didn't give an order ID"
			);
		},
		true,
		req.headers.authorization,
		waiterPermissionLevel
	)
	response.ifGood(
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
	)
});

app.post('/orderOnTheWay', (req, res) => {
	const response = checkValidity(
		['orderID'],
		req.body,
		(msg: string, status: number) => {
			res.status(status)
			res.send(msg);
			logger.info(
				"A waiter tried to change order status to 'on the way' and didn't give an order ID"
			);
		},
		true,
		req.headers.authorization,
		waiterPermissionLevel
	);
	response.ifGood(
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
	)
});

app.get('/getWaiterName', (req, res) => { 
	const response = checkValidity(
		[],
		req.body,
		(msg: string, status: number) => {
			res.status(status)
			res.send(msg);
			logger.info(
				'A waiter tried to get their name but had no permission or used an unmatched token'
			);
		},
		true,
		req.headers.authorization,
		waiterPermissionLevel
	);
	response.ifGood(
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
	)
});

//----------------------------websocket requests-----------------------
io.on('connection', function (socket: socketio.Socket) {
	const response = checkValidity(
		[],
		{},
		(msg: string, _status: number) => {
			socket.emit('Error', msg);
			logger.error('Could not connect a user to the websocket');
		},
		true,
		socket.handshake.auth['token']
	);
	response.ifGood(
		(id: string) =>
			NotificationInterface.addSubscriber(
				id,
				(eventName: string, o: object) => socket.emit(eventName, o)
			)
	)
	socket.on('updateGuestLocation', (message: any) => {
		const response = checkValidity(
			['location'],
			message,
			(msg: string, _status: number) => {
				socket.emit('Error', msg);
				logger.info(
					"A user tried to update a guest's location but didn't include the location"
				);
			},
			true,
			socket.handshake.auth['token']
		);
		response.ifGood(
			(id: string) => {
				guest.updateLocationGuest(id, message['location']);
			}
		)
	});
	socket.on('updateWaiterLocation', (message: any) => {
		const response = checkValidity(
			['location'],
			message,
			(msg: string, _status: number) => {
				socket.emit('Error', msg);
				logger.info(
					"A user tried to update a waiter's location but didn't include the location"
				);
			},
			true,
			socket.handshake.auth['token'],
			waiterPermissionLevel
		);
		response.ifGood(
			(id: string) => {
				waiter.updateLocationWaiter(id, message['location']);
			}
		)
	});
	socket.on('locationErrorGuest', (message: any) => {
		const response = checkValidity(
			['errorMsg'],
			message,
			(msg: string, _status: number) => {
				socket.emit('Error', msg);
				logger.info(
					"A user tried to send an error regarding their location and didn't include an error message."
				);
			},
			true,
			socket.handshake.auth['token']
		);
		response.ifGood(
			(id: string) => {
				GuestInterface.locationErrorGuest(
					id,
					message['errorMsg']
				);
			}
		)
	});
	socket.on('locationErrorWaiter', (message: any) => {
		const response = checkValidity(
			['errorMsg'],
			message,
			(msg: string, _status: number) => {
				socket.emit('Error', msg);
				logger.info(
					"A user tried to send an error regarding their location and didn't include an error message."
				);
			},
			true,
			socket.handshake.auth['token'],
			waiterPermissionLevel
		);
		(id: string) => {
			WaiterInterface.locationErrorWaiter(
				message['errorMsg'],
				id
			);
		}
	});
});

//-------------------------admin requests------------------------------

app.post('/assignWaiter', (req, res) => {
	const response = checkValidity(
		['orderID', 'waiterIDs'],
		req.body,
		(msg: string, status: number) => {
			res.status(status)
			res.send(msg);
			logger.info(
				"A user tried to assign a waiter but didn't include order IDs or waiter ID"
			);
		},
		true,
		req.headers.authorization,
		adminPermissionLevel
	);
	response.ifGood(
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
					'The waiters were assigned successfuly. Waiter IDs: ' +
						req.body['waiterIDs'] +
						' Order ID: ' +
						req.body['orderID']
				);
			} else {
				logger.info(
					'A waiter could not be assigned. Error: ' +
						response.getError()
				);
			}
		}
	)
});

app.get('/getOrders', (req, res) => {
	const response = checkValidity(
		[],
		req.body,
		(msg: string, status: number) => {
			res.status(status)
			res.send(msg);
			logger.info(
				'A user tried to get all orders but has no permission or used an unmatched token'
			);
		},
		true,
		req.headers.authorization,
		adminPermissionLevel
	);
	response.ifGood(
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
	)
});

app.get('/getWaiters', (req, res) => {
	const response = checkValidity(
		[],
		req.body,
		(msg: string, status: number) => {
			res.status(status)
			res.send(msg);
			logger.info(
				'A user tried to get all orders but has no permission or used an unmatched token'
			);
		},
		true,
		req.headers.authorization,
		adminPermissionLevel
	);
	response.ifGood(
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
	)
});

app.get('/getWaitersByOrder', (req, res) => {
	const response = checkValidity(
		['orderID'],
		req.query,
		(msg: string, status: number) => {
			res.status(status)
			res.send(msg);
			logger.info(
				'A user tried to get waiters by order but did not include an order ID'
			);
		},
		true,
		req.headers.authorization,
		adminPermissionLevel
	);
	response.ifGood(
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
	)
});

app.get('/getReviews', (req, res) => {
	const response = checkValidity(
		[],
		req.body,
		(msg: string, status: number) => {
			res.status(status)
			res.send(msg);
			logger.info(
				'A user tried to get reviews but did not have permission or used an unmatched token'
			);
		},
		true,
		req.headers.authorization,
		adminPermissionLevel
	);
	response.ifGood(
		async _id => {
			const response = await dashboard.getReviews();
			res.send(response);
		}
	)
});

app.post('/cancelOrderAdmin', (req, res) => {
	const response = checkValidity(
		['orderID'],
		req.body,
		(msg: string, status: number) => {
			res.status(status)
			res.send(msg);
			logger.info(
				'A user tried to cancel an order but did not include an order ID'
			);
		},
		true,
		req.headers.authorization,
		adminPermissionLevel
	);
	response.ifGood(
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
	)
});

app.post('/changeOrderStatus', (req, res) => {
	const response = checkValidity(
		['orderID', 'newStatus'],
		req.body,
		(msg: string, status: number) => {
			res.status(status)
			res.send(msg);
			logger.info(
				'A user tried to change order status but did not include an order ID or a new status'
			);
		},
		true,
		req.headers.authorization,
		adminPermissionLevel
	);
	response.ifGood(
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
					'Admin could not change order status. Error: ' +
						response.getError()
				);
			}
		}
	)
});

AppDataSource.initialize().then(() => {
	reset_all().then(() => {
		httpServer.listen(PORT, () => {
			console.log(`Server is listening on port ${PORT}`);
		});
	});
});
