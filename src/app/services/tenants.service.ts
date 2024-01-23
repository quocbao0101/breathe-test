import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
  toPromise,
} from '@ngneat/query';
import queryKeys from '../react-query/constants';
import { BasePaginationResponse, BaseResponse } from '../models/base-pagination.res';
import { BaseService } from './base-service';
import { initBasePaginationRequest } from '../models/base-pagination.req';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { TenantDto } from '../models/tenant/tenant.dto';
import { CreateTenantReq, UpdateTenantReq } from '../models/tenant/tenant.req';
import { map } from 'rxjs';
import { ToggleStatusUserReq } from '../models/user/user.req';

@Injectable({ providedIn: 'root' })
export class TenantsService extends BaseService {
  [x: string]: any;
  #queryClient = injectQueryClient();
  query = injectQuery();
  mutation = injectMutation();
  message = inject(NzMessageService);
  translate = inject(TranslateService);
  router = inject(Router);
  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }
  getTenants(page: number, keyword: string, size: number) {
    return this.query({
      queryKey: [queryKeys.tenants, page, keyword, size] as const,
      queryFn: () => {
        return this.httpClient.post<BaseResponse<BasePaginationResponse<TenantDto>>>(
          `${this.baseUrl}/api/tenants/search`,
          {
            ...initBasePaginationRequest,
            filters: {
              searchKey: keyword,
            },
            page: page,
            size: size,
          }
        ).pipe(map((res) => res.data));
      },
      staleTime: Infinity,
    });
  }

  postTenants() {
    return this.mutation({
      mutationFn: (req: {
        page: number, keyword: string, size: number,
      }) => this.httpClient.post<BaseResponse<BasePaginationResponse<TenantDto>>>(
          `${this.baseUrl}/api/tenants/search`,
          {
            ...initBasePaginationRequest,
            filters: {
              searchKey: req.keyword,
            },
            page: req.page,
            size: req.size
          }
        ).pipe(map((res) => res.data)),
      },
    );
  }

  prefetch(page: number, keyword: string, size: number) {
    return this.#queryClient.prefetchQuery({
      queryKey: [queryKeys.tenants, page, keyword, size],
      queryFn: ({ signal }) => {
        return toPromise({
          source: this.httpClient.post<BaseResponse<BasePaginationResponse<TenantDto>>>(
            `${this.baseUrl}/api/tenants/search`,
            {
              ...initBasePaginationRequest,
              filters: {
                searchKey: keyword,
              },
              page: page,
              size: size,
            }
          ).pipe(map((res) => res.data)),
          signal,
        });
      },
    });
  }

  getTenantDetails(id: number) {
    return this.query({
      queryKey: [queryKeys.tenants, id] as const,
      queryFn: () => {
        return this.httpClient.get<BaseResponse<TenantDto>>(
          `${this.baseUrl}/api/tenants/${id}`
        ).pipe(map((res) => res.data));
      },
    });
  }

  createTenant() {
    return this.mutation({
      mutationFn: (reqModel: CreateTenantReq) =>
        this.http.post<BaseResponse<number>>(`${this.baseUrl}/api/tenants/create`, reqModel, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }).pipe(map((res) => res.data)),
      onError: (error: any) => {
        this.message.error(
          error.messages?.length > 0
            ? error.messages[0]
            : this.translate.instant('global.message-error')
        );
      },
      onSuccess: (data: number) => {
        this.message.success(
          this.translate.instant('tenant.message-success-created')
        );
        this.#queryClient.resetQueries({
          queryKey: [queryKeys.tenants] as const,
        });
        this.router.navigate(['/admin/tenants/details/', data]);
      },
    });
  }

  editTenant(id: number) {
    return this.mutation({
      mutationFn: (reqModel: UpdateTenantReq) =>
        this.http.put<BaseResponse<boolean>>(`${this.baseUrl}/api/tenants/${id}`, reqModel),
      onError: (error: any) => {
        this.message.error(
          error.messages?.length > 0
            ? error.messages[0]
            : this.translate.instant('global.message-error')
        );
      },
      onSuccess: () => {
        this.message.success(
          this.translate.instant('tenant.message-success-updated')
        );
        this.#queryClient.invalidateQueries({
          queryKey: [queryKeys.tenants, id] as const,
        });
        this.#queryClient.resetQueries({
          queryKey: [queryKeys.tenants] as const,
        });
      },
    });
  }

  toggleStatusTenant(id: number) {
    return this.mutation({
      mutationFn: () =>
        this.http.put<BaseResponse<boolean>>(
          `${this.baseUrl}/api/tenants/re-active/${id}`, null
        ),
      onError: (error: any) => {
        this.message.error(
          error.messages?.length > 0
            ? error.messages[0]
            : this.translate.instant('workbooks.message-error')
        );
      },
      onSuccess: () => {
        this.message.success(
          this.translate.instant('tenant.message-success-updated')
        );
        this.#queryClient.invalidateQueries({
          queryKey: [queryKeys.tenants, id] as const,
        });
        this.#queryClient.resetQueries({
          queryKey: [queryKeys.tenants] as const,
        });
      },
    });
  }
}
