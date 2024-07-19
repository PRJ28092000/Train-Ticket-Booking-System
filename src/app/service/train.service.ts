import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer, IAPIResponse, Login } from '../model/train';

@Injectable({
  providedIn: 'root'
})
export class TrainService {
  apiUrl:string = 'https://freeapi.miniprojectideas.com/api/TrainApp/';
  // dependency injection
  constructor(private http:HttpClient) { } 

  getAllStations(){
    debugger
    return this.http.get(`${this.apiUrl}GetAllStations`);    
  }

  getTrainsSearch(from: number, to:number, date:string){
    return this.http.get(`${this.apiUrl}GetTrainsBetweenStations?departureStationId=${from}&arrivalStationId=${to}&departureDate=${date}`);
  }

  createNewCustomer(registerObj: Customer){
    return this.http.post<IAPIResponse>(`${this.apiUrl}AddUpdatePassengers`,registerObj);
  }

  loginCustomer(loginObj:Login){
    return this.http.post(`${this.apiUrl}Login`, loginObj);
  }

  ticketBooking(bookingObj:any){
    return this.http.post<IAPIResponse>(`${this.apiUrl}BookTrain`,bookingObj);
  }
}
