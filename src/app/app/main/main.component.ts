import { Component,VERSION , OnInit, OnDestroy ,ChangeDetectorRef } from '@angular/core';
import { AddTaskComponent } from '../add-task/add-task.component';
import { MatDialog } from '@angular/material/dialog';

import { BehaviorSubject, NEVER, timer, Observable, Observer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiCallService } from 'src/app/api-call.service';

function timerWithPause(
  starterStopper: Observable<boolean>,
  pauser: Observable<boolean>,
  fps: number
): Observable<number> {
  return new Observable((obs: Observer<number>) => {
    let i = 0;
    let ticker = starterStopper.pipe(
      switchMap(start => {
        if (start) return timer(0, 1000 / fps).pipe(map(_ => i++));
        i = 0;
        return NEVER;
      })
    );

    let p = pauser.pipe(switchMap(paused => (paused ? NEVER : ticker)));
    return p.subscribe({
      next: val => obs.next(val),
      error: err => obs.error(err),
      complete: () => obs.complete()
    });
  });
}
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

  
mainObject:any=[]
currentdate=new Date();
name = 'Angular ' + VERSION.major;
display: any;
public timerInterval: any;

constructor(public dialog: MatDialog,
public api  :ApiCallService,private cdr: ChangeDetectorRef){

}
pauser = new BehaviorSubject<boolean>(false);
starterStopper = new BehaviorSubject<boolean>(false);
stopWatch = new BehaviorSubject<string>('00:00,00');
laps:any = [];
itemCalled:any;
  ngOnInit(){
    timerWithPause(this.starterStopper, this.pauser, 100).subscribe({
      next: value => this.stopWatch.next(this.msToDhms(value))
    });

    // alert('hey')
    // fetch('https://jsonplaceholder.typicode.com/todos/100')
    // .then(response => response.json())
    // .then(json => 

    //   // this.itemCalled= json
    //   console.log(json)

      
      
      
    //   )
      this.api.methodtocallService().subscribe((res:any)=>{
        console.log('response',res)
let item = delete(res.userId)
console.log(item);
      })


 


  }



  handleStarter(i:any) {
    // this.mainObject[i].timearrary.push(this.pauser.value)
    console.log(' this.mainObject', this.mainObject)
    if (this.starterStopper.value) {
      if (this.pauser.value) {
        this.pauser.next(false);
        this.laps = [...this.laps, this.stopWatch.value];
        this.mainObject[i].timearrary= this.laps
      } else {
        this.pauser.next(true);
        this.laps = [...this.laps, this.stopWatch.value];
        this.mainObject[i].timearrary= this.laps
      }
    } else {
      this.starterStopper.next(true);
      this.laps = [...this.laps, this.stopWatch.value];
        this.mainObject[i].timearrary= this.laps
    }
  }

  handleLapper(i:any) {
    if (this.starterStopper.value) {
      if (this.pauser.value) {
        this.starterStopper.next(false);
        this.pauser.next(false);
        this.laps = [];
        this.stopWatch.next('00:00,00');
      } else {
        this.laps = [...this.laps, this.stopWatch.value];
        this.mainObject[i].timearrary= this.laps
      }
    }
  }

  msToDhms(msElapsed:any) {
    let padZero = (value: number) => String(value).padStart(2, '0');

    msElapsed = Number(msElapsed);
    const hElapsed = msElapsed / 360000;
    const hRemaining = hElapsed % 24;
    const sRemaining = (hRemaining * 3600) % 3600;

    const d = Math.floor(hElapsed / 24);
    const h = Math.floor(hRemaining);
    const m = Math.floor(sRemaining / 60);
    const s = Math.floor(sRemaining % 60);
    const ms = Math.floor((sRemaining % 1) * 100);

    const dDisplay = d > 0 ? padZero(d) + (d == 1 ? ' Day, ' : ' Days, ') : '';
    const hDisplay = h > 0 ? padZero(h) + ':' : '';
    const mDisplay = padZero(m) + ':';
    const sDisplay = padZero(s) + ',';
    const msDisplay = padZero(ms);
    return `${dDisplay}${hDisplay}${mDisplay}${sDisplay}${msDisplay}`;
  }

  ngOnDestroy() {
    this.starterStopper.complete();
    this.pauser.complete();
  }

  addTask(){
    let obj :any={
nameTask:'',
startButton:true,
stopButton:false,
EndButton:false,
startTime : 0,
running :false,
elapsedTime :0,
timearrary:[{
  endtime:0,
  starttime:0
}]
    }
    debugger
    this.mainObject.push(obj)
debugger
    console.log('this.mainObject',  this.mainObject)
  }


  startStopwatch(i:any,time:any) {
    console.log(time)
    this.mainObject[i].totaltime = time;
    
    this.mainObject.forEach((element:any)=>{
     this.maintime=+ element.totaltime
    })
    this.mainObject[i].startButton=false
    console.log(this.mainObject[i])

    let j= this.mainObject[i].timearrary.length

    if (! this.mainObject[i].running) {
      let obj:any={
        endtime:0,
        starttime:0
      }
      this.mainObject[i].timearrary.push(obj)
      this.mainObject[i].startTime = Date.now()-this.mainObject[i].elapsedTime;
      this.mainObject[i].running = true;
      this.updateTime(i);
      this.mainObject[i].timearrary[j].starttime=time


    } else {

      this.mainObject[i].running = false;
      this.mainObject[i].timearrary[j-1].endtime=time
console.log(this.mainObject[i])
    }
  }

  pauseStopwatch(i:any) {
    this.mainObject[i].running = false;
    this.mainObject[i].timearrary.push(this.formatTime(i))
  }

  resetStopwatch(i:any) {
    this.mainObject[i].elapsedTime = 0;
    if ( this.mainObject[i].running) {
      this.mainObject[i].startTime = Date.now();
    }
  }

  // updateTime(i:any) {
  //   if ( this.mainObject[i].running) {
  //     setTimeout(() => {
  //       this.mainObject[i].elapsedTime = Date.now() -  this.mainObject[i].startTime;
  //       this.mainObject[i].updateTime(i);
  //     }, 10);
  //   }
  // }
  maintime:any=0;
  time:any;
  updateTime(i:any) {
    if (this.mainObject[i].running) {
      setTimeout(() => {
        this.mainObject[i].elapsedTime = Date.now() - this.mainObject[i].startTime;
        // this.maintime +=  this.formatTime(i) ;
       
        this.time= this.secondsToStopwatchTime( this.maintime);

        this.cdr.detectChanges(); // Manually trigger change detection
        this.updateTime(i);

      }, 10);
    }
  }
   secondsToStopwatchTime(totalSeconds:any) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
  formatTime(i:any) {
    
    const minutes = Math.floor( this.mainObject[i].elapsedTime / 60000);
    const seconds = (( this.mainObject[i].elapsedTime % 60000) / 1000).toFixed(1);
    return `${minutes}:${(+seconds < 10 ? '0' : '')}${seconds}`;
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '646px',
      // data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
if(result!=undefined && result != ''){

  
  let obj :any={
    nameTask:result,
    startButton:true,
    stopButton:false,
    EndButton:false,
    startTime : 0,
    totaltime:0,
running :false,
elapsedTime :0,
timearrary:[

]
        }
        this.mainObject.push(obj)
}

});
  }

  deleteitem(i:any){
    this.mainObject.splice(i,1)
  }


  start() {
    this.timer(2);
  }
  stop() {
    clearInterval(this.timerInterval);
  }

  timer(minute:any) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    this.timerInterval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        console.log('finished');
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }
  number:number=0;

  button1(){
this.number=this.number+2
  }

  button2(){
    this.number=this.number-3

  }


  countdown:number=30;
  timeInterval:any;


  startCountDown(){

    this.countdown=30;
    clearInterval(this.timeInterval);
    this.updatetimer();
    this.timeInterval=setInterval(()=>this.updatetimer(),1000)

  }

  updatetimer(){
    this.countdown--;
    if(this.countdown<0){
      clearInterval(this.timeInterval);
      this.countdown=0;
    }

  }

  reset(){
    
    this.countdown=30;
    clearInterval(this.timeInterval);
    this.updatetimer();
    this.timeInterval=setInterval(()=>this.updatetimer(),1000)
  }
}


