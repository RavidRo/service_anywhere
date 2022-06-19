import {Response, Request, NextFunction, Router} from 'express';
import {makeFail, ResponseMsg} from 'server/Response';

// HTTP methods
export enum Method {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE',
}

// Route interface for each route in `routes` field of `Controller` class.
type Handler = (
	parameters: any,
	req: Request,
	res: Response,
	next: NextFunction
) => ResponseMsg<unknown> | Promise<ResponseMsg<unknown>>;
type HandlerWarper = (
	req: Request,
	res: Response,
	next: NextFunction
) => void | Promise<void>;
interface IRoute {
	path: string;
	method: Method;
	handler: Handler;
	localMiddleware: ((
		req: Request,
		res: Response,
		next: NextFunction
	) => void)[];
}

export default abstract class Controller {
	//Router instance for mapping routers
	public router: Router = Router();
	// The path on with this.routes will be mapped
	public abstract path: string;
	// Array of objects which implement IRoutes interface
	protected abstract readonly routes: IRoute[];

	public setRoutes = (): Router => {
		for (const route of this.routes) {
			for (const mw of route.localMiddleware) {
				this.router.use(route.path, mw);
			}

			const wrappedHandler = this.handlerWrapper(
				route.method,
				route.handler
			);
			switch (route.method) {
				case 'GET':
					this.router.get(route.path, wrappedHandler);
					break;
				case 'POST':
					this.router.post(route.path, wrappedHandler);
					break;
				case 'PUT':
					this.router.put(route.path, wrappedHandler);
					break;
				case 'DELETE':
					this.router.delete(route.path, wrappedHandler);
					break;
				default:
					throw new Error(
						'Miss match between switch cases and method enum in Controller'
					);
			}
		}

		return this.router;
	};

	private handlerWrapper(method: Method, func: Handler): HandlerWarper {
		return async function (
			req: Request,
			res: Response,
			next: NextFunction
		): Promise<void> {
			try {
				const parameters = method === Method.GET ? req.query : req.body;
				const response = await func(parameters, req, res, next);
				const statusCode = response.getStatusCode();

				if (response.isSuccess()) {
					const data = response.getData();
					res.status(statusCode).json(data);
				} else {
					res.status(statusCode).send(response.getError());
				}
			} catch (e) {
				res.status(500);
			}
		};
	}

	protected async validateArgs<
		T,
		U,
		F extends (...args: never[]) => Promise<ResponseMsg<T, U>>
	>(func: F, ...args: Parameters<F>): Promise<ResponseMsg<T, U>> {
		const badRequest = args.some(arg => arg === undefined);
		if (badRequest) {
			return makeFail('Missing required parameter', 400);
		}
		return func(...args);
	}

	protected getUserID(req: Request): string {
		if (!req.userID) {
			throw new Error(
				'User ID was used in handler but the authentication middle ware was not used'
			);
		}
		return req.userID;
	}
}
