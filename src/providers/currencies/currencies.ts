import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/*
  Generated class for the CurrenciesProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CurrenciesProvider {

  constructor(public http: HttpClient) {
    console.log('Hello CurrenciesProvider Provider');
  }

  getPrice(currency) : Observable<object> {
    //return this.http.get(`https://min-api.cryptocompare.com/data/price?fsym=ONZ&tsyms=${currency}`);

    return this.http.get(`https://cryptohub.online/api/market/ticker/ONZ/`);
  }

  getPrice_ONZ_later(currency) : Observable<object> {
    
    return this.http.get(`https://min-api.cryptocompare.com/data/price?fsym=ONZ&tsyms=${currency}`);

  }

  getPrice_ONZ(currency) : Observable<object> {
    
    return this.http.post(`http://85.214.66.2:8081/api/server?cur=${currency}`,"");

  }

}
