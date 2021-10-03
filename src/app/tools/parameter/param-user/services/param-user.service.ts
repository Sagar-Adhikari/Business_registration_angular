import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as G from '../../graphql/param.gql';
import { map } from 'rxjs/operators';
import { ParamInput } from 'src/app/generated/graphql';

@Injectable({
  providedIn: 'root'
})
export class ParamUserService {

  constructor(private apollo: Apollo) {

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

  public findAllGroup() {
    return this.apollo
      .query<any>({
        query: G.getParamGroupList,
        fetchPolicy: 'no-cache'
      }).pipe(
        map((res): any => {
          const groups = this.getNestedChildren(res.data.groups, null);
          return { groups: groups };
        })
      );
  }

  public findChildParameter(parentId: number) {
    return this.apollo
      .query<any>({
        query: G.getChildParam,
        fetchPolicy: 'network-only',
        variables: { parentId: parentId }
      }).pipe(
        map((res): any => {
          return res.data.childs;
        })
      );
  }

  public getParamUserById(parentId: number) {
    return this.apollo
      .query<any>({
        query: G.getParamById,
        fetchPolicy: 'network-only',
        variables: { id: parentId }
      }).pipe(
        map((res): any => {
          return res.data;
        })
      );
  }

  public save(data: ParamInput) {
    return this.apollo
      .mutate({
        mutation: G.saveParam,
        variables: {
          data: data
        },
      }).pipe(
        map(res => {
          return res;
        })
      );
  }

  public delete(id: number) {
    return this.apollo
      .mutate({
        mutation: G.deleteParam,
        variables: {
          id: id
        },
      }).pipe(
        map(res => {
          return res;
        })
      );
  }
  public getDetailsForEdit(paramId: number, parentId: number) {
    return this.apollo
      .query<any>({
        query: G.getParamWithDetails,
        fetchPolicy: 'network-only',
        variables: { id: paramId, parentId: parentId }
      }).pipe(
        map((res): any => {
          return res.data;
        })
      );
  }


  public filter(array: any[], text: string) {
    return JSON.parse(JSON.stringify(array)).filter(function iter(o) {
      let temp: any;
      if (o.name.toLowerCase().includes(text)) {
        return true;
      }
      if (!Array.isArray(o.children)) {
        return false;
      }
      temp = o.children.filter(iter);
      if (temp.length) {
        o.children = temp;
        return true;
      }
    });
  }
}
