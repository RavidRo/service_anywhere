import {Notifier} from '../Logic/Notification/Notifier'

function addSubscriber(id: string, send: (eventName: string, o: object) => boolean): void{
    new Notifier().addSubscriber(id, send)
}

export default{
    addSubscriber
}