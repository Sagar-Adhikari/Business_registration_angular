import gql from 'graphql-tag';

const backupDB = gql`
  mutation backupDB {
    backupDB
  }
`;

export {
    backupDB
};
