import { Output, EventEmitter, Component, Input ,AfterViewInit, ElementRef, ViewChild, Renderer2} from '@angular/core';

@Component({
  selector: 'app-dice-ui',
  templateUrl: './dice-ui.component.html',
  styleUrls: ['./dice-ui.component.scss']
})
export class DiceUIComponent implements AfterViewInit  {

  @Input() canPlay:boolean = true;

  @Output() newItemEvent = new EventEmitter<number>();
  @ViewChild('cube') el!: ElementRef;

  constructor(private renderer: Renderer2) {

  }

  ngAfterViewInit() {

  }
  audio = new Audio('../../assets/dice.mp3');
  isRolling: boolean = false;

onclick() {
  if(this.isRolling == true || !this.canPlay){
    return
  }
  this.audio.play();
  this.isRolling = true;
  let min = 1;
  let max = 24;
  let xRand:number = this.getRandom(max, min);
  let yRand:number = this.getRandom(max, min);
  this.renderer.setStyle(this.el.nativeElement, 'webkitTransform', 'rotateX('+xRand+'deg) rotateY('+yRand+'deg)');
  this.renderer.setStyle(this.el.nativeElement, 'transform', 'rotateX('+xRand+'deg) rotateY('+yRand+'deg)');
  setTimeout(()=>{
    this.newItemEvent.emit(this.getResult(xRand, yRand));
    this.isRolling = false;
  }, 3100)


}

 getRandom(max:number, min:number) {
  return (Math.floor(Math.random() * (max-min)) + min) * 90;
}

 mod(n:number, m:number) {
  return ((n % m) + m) % m;
}

 getResult(rotX:number, rotY:number) {
  let countX:number = this.mod(rotX / 90, 4);
  if (countX === 1) {
      // Bottom face
      return 6;
  }
  if (countX === 3) {
      // Top face
      return 5;
  }
  // We add countX here to correctly offset in case it is a 180 degrees rotation
  // It can be 0 (no rotation) or 2 (180 degrees)
  let countY = this.mod(rotY / 90 + countX, 4);
  // Faces order
  return [1, 4, 2, 3][countY];
}

}
