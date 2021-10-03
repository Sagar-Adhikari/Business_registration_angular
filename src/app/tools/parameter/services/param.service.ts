import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as Q from '../graphql/param.gql';
import { map } from 'rxjs/operators';
import { ParamValueInput } from 'src/app/generated/graphql';
import { GlobalService } from 'src/app/shared';


@Injectable({
    providedIn: 'root'
})
export class ParamService {

    constructor(private apollo: Apollo, private globalService: GlobalService) {

    }

    public findSystemDatatypes() {
        return this.apollo
            .query<any>({
                query: Q.getDataTypeList,
                fetchPolicy: 'network-only',
            }).pipe(
                map((res): any => {
                    return { dataTypes: res.data.dataTypes };
                })
            );
    }


    public getParamListForDefaultValue() {
        return this.apollo
            .query<any>({
                query: Q.getParamListForDefaultValue,
                fetchPolicy: 'network-only',
            }).pipe(
                map((res): any => {
                    const param: any[] = this.makeTreeData(res.data.groups, null);
                    return { groupTree: param };
                })
            );
    }


    private makeTreeData(arr: any[], parentId: number): any[] {
        const out = [];
        for (const i in arr) {
            if (arr[i].parentId === parentId) {
                const children = this.getNestedChildren(arr, +arr[i].id);
                if (children.length) {
                    arr[i].children = children;
                }
                out.push(arr[i]);
            } else {

            }
        }
        return out;
    }

    private getNestedChildren(arr: any[], parentId: number) {
        const out = [];
        for (const i in arr) {
            if (arr[i].parentId === parentId) {
                const children = this.getNestedChildren(arr, +arr[i].id);

                if (children.length) {
                    arr[i].children = children;
                }
                out.push(arr[i]);
            }
        }
        return out;
    }

    public updateParamUserDefaultValue(data: ParamValueInput) {
        return this.apollo
            .mutate({
                mutation: Q.updateParamValue,
                variables: {
                    data: data
                },
            }).pipe(
                map(res => {
                    this.getParamValues().subscribe(x => {
                        this.globalService.loadProperties(x);
                    });
                    return res;

                })
            );
    }

    public getParamByCode(code: string) {
        return this.apollo
          .query<any>({
            query: Q.getParamValueByParamCode,
            fetchPolicy: 'network-only',
            variables: { code: code }
          }).pipe(
            map((res): any => {
              return res.data;
            })
          );
      }

    public getParamValues() {
        return this.apollo
            .query<any>({
                query: Q.getParamValues,
                fetchPolicy: 'no-cache'
            }).pipe(
                map((res): any => {
                    return res.data.values;
                })
            );
    }
}
