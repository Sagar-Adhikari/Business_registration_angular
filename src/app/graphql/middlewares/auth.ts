import { setContext } from 'apollo-link-context';
import { GraphQLRequest } from 'apollo-link';

import { AuthService } from '../../core/services/auth.service';

function createAuthLink(authService: AuthService) {
  const authLink = setContext((operation: GraphQLRequest, prevContext: any) => {
    const jwt: any = authService.getToken();
    if (!jwt) {
      return {};
    } else {
      return {
        headers: { 'x-token': `${jwt.token}`, 'x-refresh-token': `${jwt.refreshToken}` }
      };
    }
  });
  return authLink;
}

export { createAuthLink };
