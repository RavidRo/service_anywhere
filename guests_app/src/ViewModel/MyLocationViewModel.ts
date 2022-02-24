import Communicate from "../Communication/Communicate";
import { MyLocationModel } from "../Model/MyLocationModel";
import Location, { LocationService } from "../types";

export class MyLocationViewModel {
    private locationModel = MyLocationModel.getInstance();
    private communicate: Communicate;
    private locationService: LocationService;

    getLocation()
    {
        return this.locationModel.location;
    }
    startTracking(){
        throw new Error("Method not implemented.");
    }
    stopTracking(){
        throw new Error("Method not implemented.");
    }
}