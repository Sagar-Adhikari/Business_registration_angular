import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as G from './app.gql';
import { map } from 'rxjs/operators';
import { GlobalService } from 'src/app/shared';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    constructor(
        private apollo: Apollo,
        private globalService: GlobalService
    ) {
    }


    public backupDB() {
       return this.apollo
      .mutate({
        mutation: G.backupDB,
      })
      .pipe(
        map(res => {
          return res;
        })
      );
    }
}
