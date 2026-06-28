import { Component , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  userName:string ='';
  userJob:string='Project Manager';
  userLetters: string='';
 isDropdownOpen:boolean= false;

  constructor(private authService:AuthService){}

  ngOnInit() {
    this.authService.getUserData().subscribe({
      next:(res:any) =>{
        console.log('name',res);
        
        this.userName = res.user_metadata?.full_name || res.user_metadata?.display_name || 'User';
        this.generateAvatar(this.userName);
      },
      error: (err) => {
        console.error('Error',err)
      }
      
    })
    
  }

  generateAvatar(name:string){

    const words = name.trim().split(' ');
    if(words.length >= 2){
      this.userLetters = (words[0][0]+words[1][0]).toUpperCase();

    }else{
      this.userLetters = name.substring(0,2).toUpperCase();
    }

  }
  toggleDropDown(){
    this.isDropdownOpen = !this.isDropdownOpen;
  }


}
