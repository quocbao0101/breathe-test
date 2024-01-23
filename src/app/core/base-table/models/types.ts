import {
  NzTableFilterFn,
  NzTableSortFn,
  NzTableSortOrder,
} from 'ng-zorro-antd/table';

export interface Dictionary {
  [key: string]: any;
}

export enum COL_DATA_TYPE {
  TEXT,
  NUMBER,
  CURRENCY,
  DATE,
}

export type SortOrder = NzTableSortOrder;
export type SortFunc = NzTableSortFn;
export type FilterFunc = NzTableFilterFn;
export interface FilterItem {
  text: string;
  value: string | number;
  byDefault: boolean;
}

export interface IDataTable {
  rows: Dictionary[];
  page: number;
  pageSize: number;
  totalCount: number;
}
