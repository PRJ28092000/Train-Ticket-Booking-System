import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./Pages/home/home.component";
import { Customer, IAPIResponse, Login } from './model/train';
import { FormsModule } from '@angular/forms';
import { TrainService } from './service/train.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, HomeComponent, FormsModule]
})
export class AppComponent {
  title = 'Train Booking System';

  registerObj : Customer = new Customer();
  loginObj :  Login = new Login();
  loggedInUserData : Customer = new Customer();
  trainService = inject(TrainService);

  constructor(){
    const localdata = localStorage.getItem('trainApp');
    // to store the data while refresh the page
    if(localdata!=null){
      this.loggedInUserData = JSON.parse(localdata);
    }
  }

  openRegister(){
    const model = document.getElementById("registerModel");
    if(model!=null){
      model.style.display = 'block';
    } 
  }

  openLogin(){
    const model = document.getElementById("loginModel");
    if(model!=null){
      model.style.display = 'block';
    }
  }

  closeRegister(){
    const model = document.getElementById("registerModel");
    if(model!=null){
      model.style.display = 'none';
    }
  }

  closeLogin(){
    const model = document.getElementById("loginModel");
    if(model!=null){
      model.style.display = 'none';
    }
  }

  onRegister(){
    this.trainService.createNewCustomer(this.registerObj).subscribe((res:IAPIResponse)=>{
      if(res.result){
        alert("Registration Success");
        this.closeRegister();
      }else{
        alert(res.message);
        this.closeRegister();
      }

    })
  }

  onLogin(){
    this.trainService.loginCustomer(this.loginObj).subscribe((res:any)=>{
      if(res.result){
        alert("Login Success");
        localStorage.setItem('trainApp', JSON.stringify(res.data));
        this.loggedInUserData = res.data;
        this.closeLogin();
      }else{
        alert(res.message);
        this.closeLogin();
      }
    })
  }

  onlogOut(){
    this.loggedInUserData = new Customer();
    localStorage.removeItem('trainApp');

  }
}
