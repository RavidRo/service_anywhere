import {Notifier} from '../Logic/Notification/Notifier'

function addSubscribers(id: string, send: (eventName: string, o: object) => boolean): void{
    Notifier.addSubscribers(id, send)
}

export default{
    addSubscribers
}