import gql from 'graphql-tag';


const isEmailVerified = gql`
  query isVerified
  {
   user: me{
      emailConfirmedOn
    }
  }
`;

export { isEmailVerified };
