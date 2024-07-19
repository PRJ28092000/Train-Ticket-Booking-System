import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Customer, IAPIResponse, IStation, ITrain, PassengerDetails, Search } from '../../model/train';
import { TrainService } from '../../service/train.service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit{
  activatedRoute = inject(ActivatedRoute);
  trainService = inject(TrainService);
  searchData: Search = new Search();
  trainList : ITrain[] = [];
  stationList : IStation[] = [];
  selectedTrain? : ITrain;
  passengerDetails : PassengerDetails = new PassengerDetails();

  constructor(){
    const localdata = localStorage.getItem('trainApp');
    if(localdata != null){
      this.loggedInUserData = JSON.parse(localdata);

    }
    this.activatedRoute.params.subscribe((res:any)=>{
      debugger;
      this.searchData.fromStationId = res.sourceId;
      this.searchData.toStationId = res.destinationId;
      this.searchData.dateOfTravel = res.dateofTravel;
      console.log(res);
      this.getSearchTrains();
    })
  }
  ngOnInit(): void {
    this.getAllStations();
  }

  getSearchTrains(){
    this.trainService.getTrainsSearch(this.searchData.fromStationId, this.searchData.toStationId, this.searchData.dateOfTravel).subscribe((res:any)=>{
      console.log(res);
      this.trainList = res.data;
    })
  }

  getAllStations(){
    debugger
    this.trainService.getAllStations().subscribe((res:any)=>{
      debugger
      this.stationList = res.data;
      
    })
  }

  openBookPopup(train:ITrain){
    this.selectedTrain = train;
    const model = document.getElementById("myBookModal");
    if(model!=null){
      model.style.display = 'block';
    } 
  }

  closeBookPopup(){
    const model = document.getElementById("myBookModal");
    if(model!=null){
      model.style.display = 'none';
    } 
  }
  //add passengers in array
  passengerList : any[]=[]
  addPassengers(){
    const strObj = JSON.stringify(this.passengerDetails);
    const parseObj = JSON.parse(strObj);
    // it is holding the reference of that object in that array so we need to detach it
    this.passengerList.push(parseObj);

  }

  removePassengerByIndex(index: number) {
  if (index > -1 && index < this.passengerList.length){
    this.passengerList.splice(index, 1);}
  }
  loggedInUserData : Customer = new Customer();
  bookTicket(){
    debugger
    const bookingObj = {
      "bookingId": 0,
      "trainId": this.selectedTrain?.trainId,
      "passengerId": this.loggedInUserData.passengerID,
      "travelDate": this.searchData.dateOfTravel,
      "bookingDate": new Date(),
      "totalSeats": 0,
      "TrainAppBookingPassengers": [] as any
    };
    bookingObj.TrainAppBookingPassengers = this.passengerList;
    bookingObj.totalSeats = this.passengerList.length;

    this.trainService.ticketBooking(bookingObj).subscribe((res:IAPIResponse)=>{
      debugger
      if(res.result){
        alert("Your ticket has been booked successfully")
      }else{
        alert(res.message);
      }

    })

  }

  generatePdf() {
    const doc = new jsPDF();

    // Example content
    doc.text('Ticket Details', 10, 10);
    this.passengerList.forEach((passenger, index) => {
      doc.text(`Passenger ${index + 1}:`, 10, 20 + index * 10);
      doc.text(`Name: ${passenger.name}`, 20, 30 + index * 10);
      doc.text(`Age: ${passenger.age}`, 20, 40 + index * 10);
      // Add more details as needed
    });

    // Save the PDF
    doc.save('ticket.pdf');
  }
}


