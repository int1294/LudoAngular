import { Component } from '@angular/core';
import {BoardService} from '../board.service';



@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {



  constructor(private service: BoardService){

  }
  getColor(arg:number) {
    return this.service.getColor(arg)
  };
  turn() {
    return this.service.getTurn();
  }

  DieResult(){
    return this.service.GetDieResult();
  }
  ProcessInput(event:number){
    this.service.ProcessInput(event);
  }
  GameBoard = this.service.GameBoard;
  canPlay() {
    return this.service.getCanPlay();
  }
  CalculateStep(pin:any) {
    this.service.CalculateStep(pin);
  }
}
