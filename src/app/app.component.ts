import { Component, VERSION } from '@angular/core';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  readonly displayedColumns = ['position', 'name', 'weight', 'symbol'];
  readonly columns = [
    {
      name: 'position',
      label: 'Position',
      dataExtractor: ({ position }: PeriodicElement) => position,
    },
    {
      name: 'name',
      label: 'Name',
      dataExtractor: ({ name }: PeriodicElement) => name,
    },
    {
      name: 'weight',
      label: 'Weight',
      dataExtractor: ({ weight }: PeriodicElement) => weight,
    },
    {
      name: 'symbol',
      label: 'Symbol',
      dataExtractor: ({ symbol }: PeriodicElement) => symbol,
    },
  ];
  dataSource = ELEMENT_DATA;
  disabledFields = new Set<string>();

  constructor() {
    for (let i = 0; i < this.dataSource.length; i++) {
      for (let j = 0; j < this.columns.length; j++) {
        if (Math.random() < 0.3) {
          this.disabledFields.add(`${i}-${j}`);
        }
      }
    }
  }
}
