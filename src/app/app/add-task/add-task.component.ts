import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {
  name:any=''

  constructor(    @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AddTaskComponent>,
  
  ){

  }

  ngOnInit(){



  }

  submit(){
    this.dialogRef.close(this.name );

  }
}
