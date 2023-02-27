import { Component } from '@angular/core';

interface Pin {
  direction:string,
  ix: number,
  iy: number
  x: number,
  y: number,
  ownerID:number,
  isPlaying: boolean,
  id:number

}
interface Board {

  pins : Pin[]

}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {

  canPlay:Boolean = true;
  DieResult:number = 0;
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

  move(p:Pin){



    if(p.isPlaying){

      if(p.x == 7 && p.y == 7) {
        p.isPlaying = false
        return;
      }

      console.log(p.x,p.y)
      if(Math.floor(p.x)==5 && Math.floor(p.y) ==6){
        p.x = 6; p.y = 5;
        p.direction = 'up'
        return;
      }

      if(Math.floor(p.x)==6 && Math.floor(p.y) ==0){
        p.direction = 'right'
      }
      if(Math.floor(p.x)==14 && Math.floor(p.y) ==6){
        p.direction = 'down'
      }
      if(Math.floor(p.x)==8 && Math.floor(p.y) ==0){
        p.direction = 'down'
      }
      if(Math.floor(p.x)==14 && Math.floor(p.y) ==8){
        p.direction = 'left'
      }
      if(Math.floor(p.x)==8 && Math.floor(p.y) ==14){
        p.direction = 'left'
      }
      if(Math.floor(p.x)==6 && Math.floor(p.y) ==14){
        p.direction = 'up'
      }
      if(Math.floor(p.x)==0 && Math.floor(p.y) ==8){
        p.direction = 'up'
      }
      if(Math.floor(p.x)==0 && Math.floor(p.y) ==6){
        p.direction = 'right'
      }
      if(Math.floor(p.x)==8 && Math.floor(p.y) ==5){
        p.x = 9; p.y = 6;
        p.direction = 'right'
        return;
      }

      if(Math.floor(p.x)==6 && Math.floor(p.y) ==9){
        p.x = 5; p.y = 8;
        p.direction = 'left'
        return;
      }


      if(Math.floor(p.x)==9 && Math.floor(p.y) ==8){
        p.x = 8; p.y = 9;
        p.direction = 'down'
        return;
      }

      if(Math.floor(p.x)==7 && Math.floor(p.y) ==14 && p.ownerID == 4){
        p.direction = 'up'
      }
      if(Math.floor(p.x)==0 && Math.floor(p.y) ==7 && p.ownerID == 1){
        p.direction = 'right'
      }
      if(Math.floor(p.x)==14 && Math.floor(p.y) ==7 && p.ownerID == 3){
        p.direction = 'left'
      }

      if(Math.floor(p.x)==7 && Math.floor(p.y) ==0 && p.ownerID == 2){
        p.direction = 'down'
      }

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
      if (this.winvar[i] == 4 )
        alert("Player" + (i+1) +" wins")
        location.reload();
    }
  }

  CalculateStep(pin:Pin){

    if(!pin.isPlaying){
      return;
    }
    if(pin.ownerID == this.turn){
      for (let i = 0; i < this.DieResult; i++) {
        this.move(pin)
      }
      this.canPlay = true;
      this.turn = ((this.turn) % 4) + 1;
      this.killCheck(pin)
      if(pin.x == 7 && pin.y == 7){
        pin.isPlaying = false
        this.winvar[pin.ownerID-1]++
      }

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
      if(homePieces!=4)
      alert("Click to piece to move")
      this.processMove(this.DieResult);

    }

  }

  RollDice() {
    let min = 1;
    let max = 6;
    this.DieResult = min + Math.floor(Math.random() * (max - min + 1));
    alert("Player" + this.turn + " rolled " + this.DieResult)
    this.CalculateTurn();

  }

   getColor(i:number) {
    switch(i){
      case 1:
        return '#66bb6a'
      case 2:
        return '#fff176'
      case 3:
        return '#29b6f6'
      case 4:
        return '#e53935'
      default:
        return 'black'
    }
  }

  GameBoard: Board = {
    pins: [
      {id:1,ix:2,iy:2,x:2,y:2,ownerID:1,isPlaying:false,direction:"right"},
      {id:2,ix:2,iy:3,x:2,y:3,ownerID:1,isPlaying:false,direction:"right"},
      {id:3,ix:3,iy:2,x:3,y:2,ownerID:1,isPlaying:false,direction:"right"},
      {id:4,ix:3,iy:3,x:3,y:3,ownerID:1,isPlaying:false,direction:"right"},

      {id:5,ix:11,iy:2,x:11,y:2,ownerID:2,isPlaying:false,direction:"down"},
      {id:6,ix:11,iy:3,x:11,y:3,ownerID:2,isPlaying:false,direction:"down"},
      {id:7,ix:12,iy:2,x:12,y:2,ownerID:2,isPlaying:false,direction:"down"},
      {id:8,ix:12,iy:3,x:12,y:3,ownerID:2,isPlaying:false,direction:"down"},

      {id:9,ix:11,iy:11,x:11,y:11,ownerID:3,isPlaying:false,direction:"left"},
      {id:10,ix:11,iy:12,x:11,y:12,ownerID:3,isPlaying:false,direction:"left"},
      {id:11,ix:12,iy:11,x:12,y:11,ownerID:3,isPlaying:false,direction:"left"},
      {id:12,ix:12,iy:12,x:12,y:12,ownerID:3,isPlaying:false,direction:"left"},

      {id:13,ix:2,iy:11,x:2,y:11,ownerID:4,isPlaying:false,direction:"up"},
      {id:14,ix:3,iy:11,x:3,y:11,ownerID:4,isPlaying:false,direction:"up"},
      {id:15,ix:2,iy:12,x:2,y:12,ownerID:4,isPlaying:false,direction:"up"},
      {id:16,ix:3,iy:12,x:3,y:12,ownerID:4,isPlaying:false,direction:"up"},


    ]
  };
}
