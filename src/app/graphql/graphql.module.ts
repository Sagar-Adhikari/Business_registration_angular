import { NgModule } from '@angular/core';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from 'apollo-cache-inmemory';
import { split, from, ApolloLink } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { OperationDefinitionNode } from 'graphql';

import { environment } from '../../environments/environment';
import { AuthService } from '../core/services/auth.service';
import { SubscriptionService } from '../core/services/subscription.service';
import { WebSocketLink } from 'apollo-link-ws';
import { errorLink, uploadLink, createAuthLink } from '../graphql/middlewares';
import introspectionQueryResultData from '../../assets/fragmentTypes.json';

@NgModule({
  declarations: [],
  imports: [],
  exports: [ApolloModule, HttpLinkModule],
  providers: []
})
export class GraphQLModule {
  constructor(
    apollo: Apollo,
    authService: AuthService,
    subscriptionService: SubscriptionService
  ) {
    const WS_URI = `wss://${environment.HOST}:${environment.PORT}${
      environment.WS_PATH
    }`;

    const wsClient = subscriptionService.getWSClient(WS_URI, {
      lazy: true,
      // When connectionParams is a function, it gets evaluated before each connection.
      connectionParams: () => {
        const jwt: any = authService.getToken();
        return {
          token: jwt.token,
          refreshToken: jwt.refreshToken
        };
      },
      reconnect: true,
      reconnectionAttempts: 5,
      connectionCallback: (error: Error[]) => {
        if (error) {
          console.log(error);
        }
        console.log('connectionCallback');
      },
      inactivityTimeout: 1000
    });

    const wsLink = new WebSocketLink(wsClient);


    const networkLink = split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(
          query
        ) as OperationDefinitionNode;
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsLink,
      uploadLink
    );
    const afterwareLink = new ApolloLink((operation, forward) => {
      return forward(operation).map(response => {
        const { response: { headers } } = operation.getContext();
        if (headers) {
          const token = headers.get('x-token');
          if (token) {
            const refreshToken = headers.get('x-refresh-token');
            const userb64 = headers.get('x-user');
            if (refreshToken && userb64) {
              const user = JSON.parse(b64DecodeUnicode(userb64));
              authService.setToken(token, refreshToken, user);
            }
          }
        }
        return response;
      });
    });

    const b64DecodeUnicode = (str: string) => {
      return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    };

    const authLink = createAuthLink(authService).concat(afterwareLink);

    const fragmentMatcher = new IntrospectionFragmentMatcher({
      introspectionQueryResultData
    });

    apollo.create({
      link: from([authLink, errorLink, networkLink]),
      cache: new InMemoryCache({ fragmentMatcher })
    });

    // apollo.create({
    //   link: from([authLink, errorLink, networkLink]),
    //   cache: new InMemoryCache({ fragmentMatcher })
    // }, 'account');
  }
}
