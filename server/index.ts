import { copyFileSync } from "fs";
import "reflect-metadata";
import {createConnection, Db} from "typeorm";
import DBManager from "./DAL/dbManager";
import { User } from "./entities/User";


let user: User = new User();
user.firstName = "aviv";
user.lastName = 'almog';
user.age = 21;

let user2: User = new User();
user.firstName = "aviv2";
user.lastName = 'almog';
user.age = 21;


let dbManager: DBManager = new DBManager();
dbManager.AddNewUser(user);
dbManager.AddNewUser(user2);

// console.log("loading users from db")
// dbManager.LoadUsers().then(users => {
//     console.log(users.length);
//     console.log(users);
// })
