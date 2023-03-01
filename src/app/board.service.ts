import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


interface Pin {
  direction:string,
  ix: number,
  iy: number
  x: number,
  y: number,
  ownerID:number,
  isPlaying: boolean,
  id:number
  heaven: boolean
}
interface Board {

  pins : Pin[]

}

@Injectable({
  providedIn: 'root'
})


export class BoardService {
  canPlay:boolean = true;
  DieResult:number = 1;
  turn:number = 1;
  winvar = [0,0,0,0]

  getBasePositon(onwer:number){
    switch(onwer){
      case 1:
        let g = document.getElementById("gstart")!;
        return {top:g.style.top,left:g.style.left};
      case 2:
        let y = document.getElementById("ystart")!;
        return {top:y.style.top,left:y.style.left};
      case 3:
        let r = document.getElementById("bstart")!;
        return {top:r.style.top,left:r.style.left};
      case 4:
        let b = document.getElementById("rstart")!;
        return {top:b.style.top,left:b.style.left};
      default:
        return {top:'0',left:'0'}
    }
  }

  getTurn(){
    return this.turn;
  }
  getCanPlay(){
    return this.canPlay;
  }

  GetDieResult(){
    return this.DieResult;
  }
  move(p:Pin){

    if(p.isPlaying){


      //Constraint for center overflow
      if(p.x == 7 && p.y == 7) {
        p.heaven = true
        this.winCheck()
        return;
      }



      //directionConstraints for board turn movement
      let directionConstraints = [
        {x:6,y:0,direction:'right'},
        {x:14,y:6,direction:'down'},
        {x:8,y:0,direction:'down'},
        {x:14,y:8,direction:'left'},
        {x:8,y:14,direction:'left'},
        {x:6,y:14,direction:'up'},
        {x:0,y:8,direction:'up'},
        {x:0,y:6,direction:'right'},
      ]

      let ownerConstraints = [
        {x:0,y:7,direction:'right',ownerID : 1},
        {x:7,y:0,direction:'down',ownerID : 2},
        {x:14,y:7,direction:'left',ownerID : 3},
        {x:7,y:14,direction:'up',ownerID : 4},
      ]

      let teleportConstraints = [
        {x:5,y:6,x1:6,y1:5,direction:'up'},
        {x:8,y:5,x1:9,y1:6,direction:'right'},
        {x:6,y:9,x1:5,y1:8,direction:'left'},
        {x:9,y:8,x1:8,y1:9,direction:'down'},
      ]

      //Parse Direction
      for( let c of directionConstraints){

        if(Math.floor(p.x)==c.x && Math.floor(p.y) ==c.y){
          p.direction = c.direction;
          break;
        }
      }

      //Parse Teleport
      for( let c of teleportConstraints){
        if(Math.floor(p.x)==c.x && Math.floor(p.y) ==c.y){
          p.direction = c.direction;
          p.x = c.x1; p.y = c.y1;
          return; //Movement is already done here, no need to move ahead for switch
        }
      }

       //Owner based Constraint parser
      for( let c of ownerConstraints){
        if(Math.floor(p.x)==c.x && Math.floor(p.y) ==c.y && p.ownerID == c.ownerID){
          p.direction = c.direction;
          break;
        }
      }

      //Movement Parser
      switch (p.direction) {
        case 'left':
          p.x-=1
          break;
        case 'right':
          p.x+=1
          break;
        case 'up':
          p.y-=1
          break;
        case 'down':
          p.y+=1
          break;
      }

      console.log(p.x,p.y) //For Debug Purpose
    }
  }

  killCheck(pin:Pin){

    let safeZones = [
      {x:1,y:6},
      {x:6,y:2},
      {x:8,y:1},
      {x:12,y:6},
      {x:13,y:8},
      {x:8,y:12},
      {x:6,y:13},
      {x:2,y:8},
    ]

    for(let c of safeZones){
      if(Math.floor(pin.x) == c.x && Math.floor(pin.y) == c.y){
        console.log(pin.id + " is in safe Zone!")
        return;
      }
    }

    for(let p of this.GameBoard.pins){
      if(Math.floor(p.x) == Math.floor(pin.x) && Math.floor(p.y) == Math.floor(pin.y) && p.id!=pin.id && p.ownerID!=pin.ownerID){
        console.log("Player "+ pin.ownerID+"["+pin.id+"]" +" killed "+ "Player "+ p.ownerID+"["+p.id+"]"+"!")
        this.toastr.info("Player "+ pin.ownerID +" 💀 "+ "Player "+ p.ownerID);
        p.x = p.ix;
        p.y = p.iy;
        p.isPlaying = false;
      }
    }
  }

  processMove(n:number){
    for (let p of this.GameBoard.pins ){
      if(!p.isPlaying && n==6 && p.ownerID == this.turn){
        let res = this.getBasePositon(p.ownerID) ;
        p.x = parseFloat(res.left)/6.66;
        p.y = parseFloat(res.top)/6.66;
        p.isPlaying= true
        this.canPlay = true;
        this.turn = ((this.turn) % 4) + 1;
        this.killCheck(p)
        break;
      }
    }

  }

  winCheck(){

    for (let i =0;i<4;i++){
      if (this.winvar[i] == 4 ){
        console.log("Player" + (i+1) +" wins")
        alert("Player " + (i+1) +" wins!!!!!!")
        alert("Starting a new game....")
        location.reload();
      }
    }
  }

  CalculateStep(pin:Pin){

    if(!pin.isPlaying || pin.heaven){
      return;
    }


    if(pin.ownerID == this.turn){
      for (let i = 0; i < this.DieResult-1; i++) {
        setTimeout(()=>{this.move(pin)},i*500) //SetTimeout for animating each step rather than just jumping to end location
      }

      //Final step has different logic
      setTimeout(()=>{ //Final step needs to enable canPlay and killCheck after all the moves are completed so, exclude from loop and write seperately as function is different
        this.move(pin);
        this.canPlay = true;
        this.killCheck(pin);
        this.turn = ((this.turn) % 4) + 1;
      if(Math.floor(pin.x) == 7 && Math.floor(pin.y) == 7){
        pin.heaven = true
        console.log("The onwer id is",pin.ownerID)
        this.winvar[pin.ownerID-1] = this.winvar[pin.ownerID-1] + 1
        this.winCheck()
      }
      },(this.DieResult-1)*500)



    }
    this.winCheck()
    //this.turn = ((this.turn) % 4) + 1;
  }

  CalculateTurn(){
    let homePieces = 0;
    for(let p of this.GameBoard.pins){
      if(p.ownerID == this.turn && !p.isPlaying){
        homePieces+=1
      }
    }
    if(homePieces == 4 && this.DieResult!=6){
      this.turn = ((this.turn) % 4) + 1;
    }else{
      this.canPlay = false
      if(homePieces!=4){
      //alert("Click to piece to move")
      }
      this.processMove(this.DieResult);

    }

  }

  ProcessInput(diceResult:any) {

    this.DieResult = diceResult
    //alert("Player" + this.turn + " rolled " + this.DieResult)
    this.CalculateTurn();
    this.winCheck();
  }

   getColor(i:number) {
    switch(i){
      case 1:
        return '#66bb6a' //green
      case 2:
        return '#fff176' //yellow
      case 3:
        return '#29b6f6' //blue
      case 4:
        return '#e53935' //yellow
      default:
        return 'black'
    }
  }

  GameBoard: Board = {
    pins: [
      {id:1,ix:1.8,iy:1.8,x:1.8,y:1.8,ownerID:1,isPlaying:false,direction:"right",heaven:false},
      {id:2,ix:1.8,iy:3.2,x:1.8,y:3.2,ownerID:1,isPlaying:false,direction:"right",heaven:false},
      {id:3,ix:3.2,iy:1.8,x:3.2,y:1.8,ownerID:1,isPlaying:false,direction:"right",heaven:false},
      {id:4,ix:3.2,iy:3.2,x:3.2,y:3.2,ownerID:1,isPlaying:false,direction:"right",heaven:false},

      {id:5,ix:10.8,iy:1.8,x:10.8,y:1.8,ownerID:2,isPlaying:false,direction:"down",heaven:false},
      {id:6,ix:10.8,iy:3.2,x:10.8,y:3.2,ownerID:2,isPlaying:false,direction:"down",heaven:false},
      {id:7,ix:12.2,iy:1.8,x:12.2,y:1.8,ownerID:2,isPlaying:false,direction:"down",heaven:false},
      {id:8,ix:12.2,iy:3.2,x:12.2,y:3.2,ownerID:2,isPlaying:false,direction:"down",heaven:false},

      {id:9,ix:10.8,iy:10.8,x:10.8,y:10.8,ownerID:3,isPlaying:false,direction:"left",heaven:false},
      {id:10,ix:10.8,iy:12.2,x:10.8,y:12.2,ownerID:3,isPlaying:false,direction:"left",heaven:false},
      {id:11,ix:12,iy:10.8,x:12.2,y:10.8,ownerID:3,isPlaying:false,direction:"left",heaven:false},
      {id:12,ix:12,iy:12.2,x:12.2,y:12.2,ownerID:3,isPlaying:false,direction:"left",heaven:false},

      {id:13,ix:1.8,iy:10.8,x:1.8,y:10.8,ownerID:4,isPlaying:false,direction:"up",heaven:false},
      {id:14,ix:3.2,iy:10.8,x:3.2,y:10.8,ownerID:4,isPlaying:false,direction:"up",heaven:false},
      {id:15,ix:1.8,iy:12,x:1.8,y:12.2,ownerID:4,isPlaying:false,direction:"up",heaven:false},
      {id:16,ix:3.2,iy:12,x:3.2,y:12.2,ownerID:4,isPlaying:false,direction:"up",heaven:false},

    ]
  };

  constructor(private toastr: ToastrService) {
    this.toastr.success('Service Injected');
  }
}
