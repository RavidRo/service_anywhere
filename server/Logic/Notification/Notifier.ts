let subscribers: Map<string,((msg: any) => boolean)[]> = new Map()

function notify(id: string, action: string, params: (string|number)[]){
    subscribers.get(id)?.forEach(send => {  //todo: confirm this
        send({action: action, params: params})
    });
}

function addSubscribers(id: string, send: (msg: any) => boolean): void{
    subscribers.get(id)?.push(send) ?? subscribers.set(id, [send])  //todo: confirm this
}