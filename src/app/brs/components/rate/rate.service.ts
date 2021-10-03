import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as G from '../rate/rate.gql';
import { map } from 'rxjs/operators';
import { RateInput } from 'src/app/generated/graphql';

@Injectable({
  providedIn: 'root'
})
export class RateService {

  constructor(private apollo: Apollo) {

  }

  public findAllGroup() {
    return this.apollo
      .query<any>({
        query: G.getRateGroupList,
        fetchPolicy: 'network-only'
      }).pipe(
        map((res): any => {
          const groups = this.getNestedChildren(res.data.groups, null);
          return { groups: groups };
        })
      );
  }


  public findChildRate(parentId: number) {
    return this.apollo
      .query<any>({
        query: G.getChildRate,
        fetchPolicy: 'network-only',
        variables: { parentId: parentId }
      }).pipe(
        map((res): any => {
          return res.data.childs;
        })
      );
  }

  public getRateById(id: number) {
    return this.apollo
      .query<any>({
        query: G.getRateById,
        fetchPolicy: 'network-only',
        variables: { id: id }
      }).pipe(
        map((res): any => {
          return res.data.rate;
        })
      );
  }


  public save(data: RateInput) {
    return this.apollo
      .mutate({
        mutation: G.saveRate,
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
        mutation: G.deleteRate,
        variables: {
          id: id
        },
      }).pipe(
        map(res => {
          return res;
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
}
