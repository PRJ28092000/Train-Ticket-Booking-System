import { Component, inject, OnInit } from '@angular/core';
import { TrainService } from '../../service/train.service';
import { IStation } from '../../model/train';
import { FormsModule} from '@angular/forms'
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  trainService = inject(TrainService);
  router = inject(Router);
  stationList : IStation[] = [];
  departureStationId : number = 0;
  arrivalStationId : number = 0;
  departureDate : string = '';

  ngOnInit(): void {
    this.getAllStations();
  }

  getAllStations(){
    debugger
    this.trainService.getAllStations().subscribe((res:any)=>{
      debugger
      this.stationList = res.data;
      
    })
  }

  onSearch(){
    if(this.departureStationId == 0 || this.arrivalStationId == 0 || this.departureDate == '')
    {
      alert("Select your journey details");
    }
    else{
      if(this.departureStationId == this.arrivalStationId){
        alert("Source and Destination can't be same")
      }
      else{
        this.router.navigate(['/search', this.departureStationId, this.arrivalStationId, this.departureDate]);       
      }
    }

  }
}
