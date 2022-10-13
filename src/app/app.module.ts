import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import {
  InlineEditControls,
  InlineEditDirective,
} from './inline-edit.directive';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [BrowserModule, FormsModule, MatTableModule, MatButtonModule],
  declarations: [
    AppComponent,
    HelloComponent,
    InlineEditDirective,
    InlineEditControls,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
