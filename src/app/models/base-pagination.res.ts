export interface BaseResponse<T> {
  message: string;
  data: T;
  status: string;
}

export interface BasePaginationResponse<T> {
  pageable: Pageable;
  totalPages: number;
  page: number;
  totalElements: number;
  last: boolean;
  sort: Sort2;
  numberOfElements: number;
  first: boolean;
  size: number;
  number: number;
  empty: boolean;
  content: T[];
}

export interface Pageable {
  sort: Sort;
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface Sort2 {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}
