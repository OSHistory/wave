import {Injectable} from "angular2/core";
import {Http, Response} from "angular2/http";
import {Observable} from "rxjs/Rx";

import {Operator} from "../models/operator.model";

import Config from "../config.model";
import {PlotData} from "../models/plot.model";

// TODO: change
const TIME_CONSTANT = "2010-06-06T18:00:00.000Z";

@Injectable()
export class MappingQueryService {
    constructor(private http: Http) {}

    getPlotQueryUrl(operator: Operator, time: string = TIME_CONSTANT): string {
        const parameters: {[index: string]: string | number | boolean} = {
            service: "plot",
            query: operator.toQueryJSON(),
            time: time,
        };
        return Config.MAPPING_URL + "?" +
               Object.keys(parameters).map(key => key + "=" + parameters[key]).join("&");
    }

    getPlotData(operator: Operator, time: string = TIME_CONSTANT): Promise<PlotData> {
        return this.http.get(this.getPlotQueryUrl(operator, time)).toPromise().then(r => r.json());
    }
}