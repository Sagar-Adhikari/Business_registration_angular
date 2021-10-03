import { ApeInput, PaginationInput } from './../../../generated/graphql';
import { GlobalService } from 'src/app/shared';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import * as G from './ape.gql';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApsService {
  constructor(private globalService: GlobalService, private apollo: Apollo) {}
  public getWardList() {
    return this.apollo
      .query<any>({
        query: G.getWardList,
        fetchPolicy: 'network-only',
        variables: { data: { pageNo: 1, pageSize: 100 } }
      })
      .pipe(
        map(
          (res): any => {
            return res.data.wards;
          }
        )
      );
  }

  public saveAPE(data: ApeInput) {
    return this.apollo
      .mutate({
        mutation: G.saveAPE,
        variables: {
          data: data
        }
      })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getAllApe(
    page?: number,
    size?: number,
    filterArray?: string[],
    sortArray?: any[]
  ) {
    const data: PaginationInput = {
      pageNo: page ? page : 0,
      pageSize: size ? size : 100,
      filter: filterArray ? filterArray : undefined,
      sort: sortArray ? sortArray : undefined
    };
    return this.apollo
      .query<any>({
        query: G.getApeList,
        variables: { data: data },
        fetchPolicy: 'no-cache'
      })
      .pipe(
        map(
          (res): any => {
            return res.data.list;
          }
        )
      );
  }
  public getApeById(id: number) {
    return this.apollo
      .query<any>({
        query: G.getApeById,
        fetchPolicy: 'network-only',
        variables: {
          id: id
        }
      })
      .pipe(
        map(
          (res): any => {
            return res.data.Ape;
          }
        )
      );
  }

  public deleteApe(id: number) {
    return this.apollo
      .mutate({
        mutation: G.deleteApe,
        variables: { id: id }
      })
      .pipe(
        map(res => {
          return res;
        })
      );
  }
}
