import {
    ContentChild,
    Directive,
    EventEmitter,
    Input,
    Output,
  } from '@angular/core';
  import { CellDirective } from './cell.directive';
  import { HeaderDirective } from './header.directive';
  import {
    COL_DATA_TYPE,
    FilterFunc,
    FilterItem,
    SortFunc,
    SortOrder,
  } from '../models/types';
  
  @Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: 't-pest-column',
  })
  export class ColumnDirective {
    @Input() width: any;
    @Input() header = '';
    @Input() key = '';
    @Input() renderKey = '';
    @Input() dataType = COL_DATA_TYPE.TEXT;
    @Input() sortable = false;
    @Input() sortOrder: SortOrder = null;
    @Input() hasBreakWord = false;
    @Input() sortFn: SortFunc | null = null;
    @Output() sortChange = new EventEmitter<{ key: string; order: SortOrder }>();
    @Input() filterable = false;
    @Input() listOfFilter: FilterItem[] = [];
    @Input() filterFn: FilterFunc | null = null;
  
    @ContentChild(CellDirective, { static: true }) tplCell?: CellDirective;
    @ContentChild(HeaderDirective, { static: true }) tplHeader?: HeaderDirective;
  
  }