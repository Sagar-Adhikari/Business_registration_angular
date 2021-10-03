import { onError } from 'apollo-link-error';

const errorLink = onError(({ graphQLErrors, networkError, operation, forward, response }) => {
  console.log(response);
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(`[GraphQL Error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
  // console.log(operation.operationName);
  // if (operation.operationName === 'IgnoreErrorsQuery') {
  // response.errors = null;
  // }
});

export { errorLink };
