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
import { UserDetailsDto } from '../models/user/user-details.dto';
import {
  CreateUserReq,
  CreateUserRequest,
  DataCommune,
  DataProvinces,
  ToggleStatusUserReq,
  UpdateUserReq,
  UserRole,
} from '../models/user/user.req';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService extends BaseService {
  #queryClient = injectQueryClient();
  query = injectQuery();
  mutation = injectMutation();
  message = inject(NzMessageService);
  translate = inject(TranslateService);
  router = inject(Router);
  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }
  getUsers(page: number, size: number, keyword: string) {
    return this.query({
      queryKey: [queryKeys.users, page, size, keyword] as const,
      queryFn: () => {
        return this.httpClient.post<BaseResponse<BasePaginationResponse<UserDetailsDto>>>(
          `${this.baseUrl}/api/users/search`,
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
    });
  }

  prefetch(page: number, size: number, keyword: string) {
    return this.#queryClient.prefetchQuery({
      queryKey: [queryKeys.users, page, size],
      queryFn: ({ signal }) => {
        return toPromise({
          source: this.httpClient.post<BaseResponse<BasePaginationResponse<UserDetailsDto>>>(
            `${this.baseUrl}/api/users/search`,
            {
              ...initBasePaginationRequest,
              filters: {
                searchKey: keyword,
              },
              page: page,
            }
          ).pipe(map((res) => res.data)),
          signal,
        });
      },
    });
  }

  getUserDetails(id: string) {
    return this.query({
      queryKey: [queryKeys.users, id] as const,
      queryFn: () => {
        return this.httpClient.get<UserDetailsDto>(
          `${this.baseUrl}/api/users/${id}`
        );
      },
    });
  }

  getRoles() {
    return this.query({
      queryKey: [queryKeys.roles] as const,
      queryFn: () => {
        return this.httpClient.get<UserRole>(
          `${this.baseUrl}/api/roles`
        );
      },
    });
  }

  getProvinces() {
    return this.query({
      queryKey: [queryKeys.provinces] as const,
      queryFn: () => {
        return this.httpClient.get<BaseResponse<DataProvinces>>(
          `${this.baseUrl}/api/provinces`
        );
      },
    });
  }

  getDistrict(id: number) {
    return this.query({
      queryKey: [queryKeys.districts, id] as const,
      queryFn: () => {
        return this.httpClient.get<BaseResponse<DataProvinces>>(
          `${this.baseUrl}/api/districts?provinceId=${id}`
        );
      },
    });
  }

  getCommune(id: number) {
    return this.query({
      queryKey: [queryKeys.commune, id] as const,
      queryFn: () => {
        return this.httpClient.get<BaseResponse<DataCommune>>(
          `${this.baseUrl}/api/communes?id=${id}`
        );
      },
    });
  }

  createUser() {
    return this.mutation({
      mutationFn: (reqModel: CreateUserRequest) =>
        this.http
          .post<string>(`${this.baseUrl}/api/users/add-users`, reqModel, {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }
          }),
      onError: (error: any) => {
        this.message.error(
          error.messages?.length > 0
            ? error.messages[0]
            : this.translate.instant('global.message-error')
        );
      },
      onSuccess: (data: string) => {
        this.message.success(
          this.translate.instant('users.message-success-created')
        );
        this.#queryClient.resetQueries({
          queryKey: [queryKeys.users] as const,
        });
        this.router.navigate(['/admin/users', data]);
      },
    });
  }

  editUser(id: string) {
    return this.mutation({
      mutationFn: (reqModel: UpdateUserReq) =>
        this.http.put<string>(`${this.baseUrl}/api/users/${id}`, reqModel),
      onError: (error: any) => {
        this.message.error(
          error.messages?.length > 0
            ? error.messages[0]
            : this.translate.instant('global.message-error')
        );
      },
      onSuccess: () => {
        this.message.success(
          this.translate.instant('users.message-success-updated')
        );
        this.#queryClient.invalidateQueries({
          queryKey: [queryKeys.users, id] as const,
        });
      },
    });
  }
}
