import { L } from '@angular/cdk/keycodes';
import {
  Directive,
  Input,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  ContentChildren,
  QueryList,
  Host,
  HostListener,
  Renderer2,
  Component,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import {
  MatColumnDef,
  MatHeaderRowDef,
  MatRow,
  MatTable,
} from '@angular/material/table';
import { BehaviorSubject, pairwise } from 'rxjs';

type Position = [number, number];

@Directive({
  selector: '[inlineEdit]',
})
export class InlineEditDirective {
  private readonly selection = new BehaviorSubject<Position[]>([]);
  private readonly cellByIndex = new Map<string, HTMLElement>();
  private maxGridSize: Position = [0, 0];
  private selectionBegin: Position | undefined;

  constructor(
    private readonly elementRef: ElementRef,
    // content queries will not pick up elements from its host here.
    // it seems to be a known issue in ivy.
    // https://ng-run.com/edit/xR0XUDYenymzk66bL8Up
    // https://ng-run.com/edit/6eYYpeZqQBbEIE6GMW83
    @Host() private readonly matTable: MatTable<unknown>
  ) {
    // assertExists(this.matTable, 'Directive must be used on MatTable');

    this.matTable.contentChanged.subscribe(() => {
      // Set timeout zero Wait for table to finish rendering before building the new grid.
      setTimeout(() => {
        this.cellByIndex.clear();
        this.selection.next([]);

        const rows: HTMLElement[] = Array.from(
          this.elementRef.nativeElement.querySelectorAll('mat-row')
        );

        let maxColumnSize = 0;
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
          const cells: HTMLElement[] = Array.from(
            rows[rowIndex].querySelectorAll('mat-cell')
          );
          maxColumnSize = Math.max(maxColumnSize, cells.length);

          for (let columnIndex = 0; columnIndex < cells.length; columnIndex++) {
            const cell = cells[columnIndex];
            const isDisabled = cell.hasAttribute('disabled');
            if (!isDisabled) {
              cell.setAttribute('rowIndex', rowIndex.toString());
              cell.setAttribute('columnIndex', columnIndex.toString());
              this.setCellByIndex(rowIndex, columnIndex, cell);
            }
          }
        }

        this.maxGridSize = [rows.length, maxColumnSize];
      }, 0);
    });

    this.selection
      .pipe(pairwise())
      .subscribe(
        ([prevSelection, newSelection]: [
          prevSelection: Position[],
          newSelection: Position[]
        ]) => {
          for (let i = 0; i < prevSelection.length; i++) {
            this.setAttributesAtPosition(prevSelection[i], false, false);
          }
          for (let i = 0; i < newSelection.length; i++) {
            this.setAttributesAtPosition(newSelection[i], true, i === 0);
          }
        }
      );
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (this.selection.value.length > 0) {
      let [rowIndex, columnIndex] = this.selection.value[0];

      do {
        switch (event.key) {
          case 'ArrowLeft':
            columnIndex -= 1;
            break;
          case 'ArrowRight':
            columnIndex += 1;
            break;
          case 'ArrowUp':
            rowIndex -= 1;
            break;
          case 'ArrowDown':
            rowIndex += 1;
            break;
        }
        if (this.getCellByIndexSafely(rowIndex, columnIndex)) {
          this.selection.next([[rowIndex, columnIndex]]);
          return;
        }
      } while (
        rowIndex >= 0 &&
        columnIndex >= 0 &&
        rowIndex < this.maxGridSize[0] &&
        columnIndex < this.maxGridSize[1]
      );
    }
  }

  @HostListener('click', ['$event.target'])
  onClick(target: HTMLElement) {
    if (target.hasAttribute('rowIndex') && target.hasAttribute('columnIndex')) {
      const targetPosition: Position = [
        Number(target.getAttribute('rowIndex')),
        Number(target.getAttribute('columnIndex')),
      ];
      this.selection.next([targetPosition]);
    }
  }

  @HostListener('mousedown', ['$event.target'])
  onMouseDown(target: HTMLElement) {
    if (
      this.selectionBegin === undefined &&
      target.hasAttribute('rowIndex') &&
      target.hasAttribute('columnIndex')
    ) {
      const targetPosition: Position = [
        Number(target.getAttribute('rowIndex')),
        Number(target.getAttribute('columnIndex')),
      ];
      this.selectionBegin = targetPosition;
    }
  }

  @HostListener('mouseover', ['$event.target'])
  onMouseOver(target: HTMLElement) {
    if (
      this.selectionBegin !== undefined &&
      target.hasAttribute('rowIndex') &&
      target.hasAttribute('columnIndex')
    ) {
      let first: Position = this.selectionBegin;
      let second: Position = [
        Number(target.getAttribute('rowIndex')),
        Number(target.getAttribute('columnIndex')),
      ];

      const fromPosition: Position = [
        Math.min(first[0], second[0]),
        Math.min(first[1], second[1]),
      ];
      const toPosition: Position = [
        Math.max(first[0], second[0]),
        Math.max(first[1], second[1]),
      ];

      const toAdd: Position[] = [];
      for (
        let rowIndex = fromPosition[0];
        rowIndex <= toPosition[0];
        rowIndex++
      ) {
        for (
          let columnIndex = fromPosition[1];
          columnIndex <= toPosition[1];
          columnIndex++
        ) {
          if (this.getCellByIndexSafely(rowIndex, columnIndex)) {
            toAdd.push([rowIndex, columnIndex]);
          }
        }
      }
      this.selection.next(toAdd);
    }
  }

  @HostListener('mouseup')
  onMouseUp() {
    this.selectionBegin = undefined;
  }

  private getCellByIndexSafely(
    rowIndex: number,
    columnIndex: number
  ): HTMLElement | null {
    const key = `${rowIndex}-${columnIndex}`;
    return this.cellByIndex.has(key) ? this.cellByIndex.get(key) : null;
  }

  private setCellByIndex(
    rowIndex: number,
    columnIndex: number,
    cell: HTMLElement
  ) {
    const key = `${rowIndex}-${columnIndex}`;
    this.cellByIndex.set(key, cell);
  }

  private setAttributesAtPosition(
    position: Position,
    select: boolean,
    active: boolean
  ) {
    const cell = this.getCellByIndexSafely(position[0], position[1]);
    if (cell) {
      if (select) {
        cell.setAttribute('selected', 'true');
      } else {
        cell.removeAttribute('selected');
      }

      if (active) {
        cell.setAttribute('active', 'true');
      } else {
        cell.removeAttribute('active');
      }
    }
  }
}

@Component({
  selector: 'inline-edit-controls',
  template: `
  <ng-container matColumnDef="inline-edit-controls">
    <mat-header-cell *matHeaderCellDef>
      <p>It works</p>
    </mat-header-cell>
  </ng-container>
  <<mat-header-row *matHeaderRowDef="['inline-edit-controls']; sticky: true">
  </mat-header-row>>`,
})
export class InlineEditControls implements AfterViewInit {
  @ViewChild(MatColumnDef, { static: true })
  private columnDef: MatColumnDef | undefined;

  @ViewChild(MatHeaderRowDef, { static: true })
  private headerRowDef: MatHeaderRowDef | undefined;

  constructor(@Host() private readonly matTable: MatTable<unknown>) {}

  public ngAfterViewInit(): void {
    if (this.headerRowDef) {
      this.matTable.addHeaderRowDef(this.headerRowDef);
      this.matTable.addColumnDef(this.columnDef);
    }
  }
}
