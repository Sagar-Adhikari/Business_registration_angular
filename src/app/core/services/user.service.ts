import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import * as M from '../graphql/mutations/user.gql';
import {
    ChangePasswordInput,
    ResetPasswordInput,
    UserAddInput,
    PaginationInput,
    UserEditInput
} from '../../generated/graphql';

@Injectable({
    providedIn: 'root'
  })
export class UserService {
    constructor(private apollo: Apollo) { }

    public login(email: string, password: string) {
        return this.apollo
            .mutate({
                mutation: M.LOGIN,
                variables: {
                    email: email,
                    password: password
                },
            })
            .pipe(
                map(res => {
                    return res;
                })
            );
    }


    public passwordReset(data: ResetPasswordInput) {
        return this.apollo
            .mutate({
                mutation: M.PASSWORD_RESET,
                variables: {
                    data: data
                },
            }).pipe(
                map(res => {
                    return res;
                })
            );
    }

    public changePassword(data: ChangePasswordInput) {
        return this.apollo
            .mutate({
                mutation: M.CHANGE_PASSWORD,
                variables: {
                    data: data
                },
            })
            .pipe(
                map(res => {
                    return res;
                })
            );
    }

    public createUser(data: UserAddInput) {
        return this.apollo
            .mutate({
                mutation: M.CREATE_USER,
                variables: {
                    data: data,
                },
            }).pipe(
                map(res => {
                    return res;
                })
            );
    }

    public editUser(data: UserEditInput) {
        return this.apollo
            .mutate({
                mutation: M.EDIT_USER,
                variables: {
                    data: data
                },
            }).pipe(
                map(res => {
                    return res;
                })
            );
    }

    public deleteUser(id: string) {
        return this.apollo
            .mutate({
                mutation: M.DELETE_USER,
                variables: { id: id },
                // fetchPolicy: 'network-only',
            }).pipe(
                map(res => {
                    return res;
                })
            );
    }

    public getUserById(id: string) {
        return this.apollo
            .query<any>({
                query: M.USER_BY_ID,
                fetchPolicy: 'network-only',
                variables: { id: id }
            }).pipe(
                map((res): any => {
                    return res.data.user;
                })
            );
    }

    public getRoles() {
        return this.apollo
            .query<any>({
                query: M.ROLE_LIST,
                fetchPolicy: 'network-only'
            }).pipe(
                map((res): any => {
                    return res.data.roles;
                })
            );
    }


    public getAllUsers(page?: number, size?: number, filterArray?: string[], sortArray?: any[]) {
        const data: PaginationInput = {
            pageNo: page ? page : 0,
            pageSize: size ? size : 10,
            filter: filterArray ? filterArray : undefined,
            sort: sortArray ? sortArray : undefined,
        };
        return this.apollo
            .query<any>({
                query: M.USER_LIST,
                variables: { data: data },
                fetchPolicy: 'network-only'
            }).pipe(
                map((res): any => {
                    return res.data.userList;
                })
            );
    }

}
