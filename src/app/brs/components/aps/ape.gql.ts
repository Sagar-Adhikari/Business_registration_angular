import gql from 'graphql-tag';

const getWardList = gql`
  query wards($data: PaginationInput!) {
    wards: wards(page: $data) {
      id
      wardNo
    }
  }
`;

const getApeList = gql`
  query getAllApe($data: PaginationInput!) {
    list: getAllApe(data: $data) {
      totalRows
      ape {
        id
        wardNo
        title
        description
        createdBy
        createdOn
      }
    }
  }
`;

const saveAPE = gql`
  mutation setApe($data: ApeInput!) {
    setApe(data: $data) {
      id
    }
  }
`;

const deleteApe = gql`
  mutation deleteApe($id: Float!) {
    deleteApe(id: $id)
  }
`;

const getApeById = gql`
  query getApeById($id: Float!) {
   Ape: getApeById(id: $id){
      id
      wardNo
      title
      description
      createdBy
      createdOn
  }
  }
`;

export { getWardList, saveAPE, getApeList, deleteApe, getApeById };
