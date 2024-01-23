import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { COL_DATA_TYPE, Dictionary } from './models/types';
import { ColumnDirective } from './directives/column.directive';

@Component({
  selector: 't-pest-base-table',
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.less'],
})
export class BaseTableComponent {
  @Input() loading = false;
  @Input() rows: Dictionary[] = [];
  @Input() clientPagination = true;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() totalRows = 0;

  @Output() pageIndexChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

  @ContentChildren(ColumnDirective) columns!: QueryList<ColumnDirective>;
  COL_DATA_TYPE = COL_DATA_TYPE;
  constructor() {
  }
}