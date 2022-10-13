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

@NgModule({
  imports: [BrowserModule, FormsModule, MatTableModule],
  declarations: [
    AppComponent,
    HelloComponent,
    InlineEditDirective,
    InlineEditControls,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
