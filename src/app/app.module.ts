import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import {
  InlineEditControlsDirective,
  InlineEditControlsRow,
  InlineEditDirective,
} from './inline-edit.directive';

@NgModule({
  imports: [BrowserModule, FormsModule, MatTableModule],
  declarations: [
    AppComponent,
    HelloComponent,
    InlineEditDirective,
    InlineEditControlsDirective,
    InlineEditControlsRow,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
