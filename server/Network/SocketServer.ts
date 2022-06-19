import NotificationInterface from 'server/Interface/NotificationInterface';
import {logger} from 'server/Logger';
import Authenticator from 'server/Logic/Authentication/Authenticator';
import GuestInterface from 'server/Interface/GuestInterface';
import * as socketIO from 'socket.io';

export type SocketEvent = {
	eventName: string;
	listener: (socket: socketIO.Socket, message: any) => void;
};

function authenticate(
	token: string | undefined,
	permissionLevel: number,
	doIfLegal: (id: string) => void,
	sendErrorMsg: (err: string) => void
) {
	if (!token) {
		return sendErrorMsg(
			"Authorization token is missing in sockets's handshake"
		);
	}
	let response = Authenticator.authenticate(token, permissionLevel);
	if (response.isSuccess()) {
		response.ifGood(doIfLegal);
	} else {
		sendErrorMsg(response.getError());
	}
}

function validateInput<F extends (...args: never[]) => void>(
	func: F,
	...args: Parameters<F>
): void {
	const badRequest = args.some(arg => arg === undefined);
	if (!badRequest) {
		func(...args);
	}
}

export const onConnection: (socket: socketIO.Socket) => void = socket => {
	authenticate(
		socket.handshake.auth['token'],
		0,
		id => {
			NotificationInterface.addSubscriber(
				id,
				(eventName: string, o: object) => socket.emit(eventName, o)
			);
		},
		err => {
			socket.emit('Error', err);
			logger.error('Could not connect a user to the websocket');
		}
	);
};

export const events: SocketEvent[] = [
	{
		eventName: 'updateGuestLocation',
		listener(socket: socketIO.Socket, message) {
			const {location} = message;

			authenticate(
				socket.handshake.auth['token'],
				1,
				(id: string) => {
					validateInput(
						GuestInterface.updateLocationGuest,
						id,
						location
					);
				},
				(err: string) => {
					socket.emit('Error', err);
					logger.info(
						"A user tried to update a guest's location but used an unmatched token"
					);
				}
			);
		},
	},
];
