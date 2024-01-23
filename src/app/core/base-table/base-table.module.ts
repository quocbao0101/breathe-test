import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { ColumnDirective } from './directives/column.directive';
import { CellDirective } from './directives/cell.directive';
import { HeaderDirective } from './directives/header.directive';
import { BaseTableComponent } from './base-table.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@NgModule({
  imports: [
    CommonModule,
    NzTableModule,
    NzPaginationModule,
    NzSpinModule,
  ],
  declarations: [
    BaseTableComponent,
    CellDirective,
    HeaderDirective,
    ColumnDirective,
  ],
  exports: [
    BaseTableComponent,
    ColumnDirective,
    CellDirective,
    HeaderDirective,
  ],
})
export class BaseTableModule {}
