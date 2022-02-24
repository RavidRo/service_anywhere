//import {makeAutoObservable} from 'mobx';
import Singleton from '../Singeltone';
import Location from '../types';


export class MyLocationModel extends Singleton{
	
	private static instance: MyLocationModel;
	private _location: Location | null;

	private constructor() {
		super();
//		makeAutoObservable(this);
	}

	public static getInstance(): MyLocationModel {
		if (!MyLocationModel.instance) {
			MyLocationModel.instance = new MyLocationModel();
		}
		return MyLocationModel.instance;
	}

    get location () {
		return this._location;
	}

	set items(location: Location) {
		this._location = location;
	}

	

	
}
