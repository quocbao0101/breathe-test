export interface BasePaginationRequest {
  sortField: string;
  filters: Filters;
  sortBy: "ASC" | "DESC";
  page: number;
  size: number;
}

export interface Filters {
  searchKey: string;
  keySearch: string;
  name: string;
  status: string;
  role: string;
}

export const BASE_PAGE_SIZE = 5;
export const initBasePaginationRequest: BasePaginationRequest = {
  filters: {
    searchKey: '',
    name: '',
    status: '',
    role: '',
    keySearch: ''
  },
  page: 1,
  size: BASE_PAGE_SIZE,
  sortBy: 'ASC',
  sortField: '',
};
