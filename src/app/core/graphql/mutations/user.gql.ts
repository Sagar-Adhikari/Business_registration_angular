import gql from 'graphql-tag';


const LOGIN = gql`
mutation login($email: String!,$password: String!)
{
  login(email:$email,password: $password) {
    token
    refreshToken,
    user {
      userId
      email
      fullName
      roleId
      roleName
      palikaName
      wardNo
    }
  }
}`;


const USER_BY_ID = gql`
  query getUserById($id: String!){
   user: getUserById(id:$id){
      id
      fullName
      firstName
      lastName
      mobileNo
      email
      status
      roleId
      passwordChangedOn
      createdOn
      wardId
      role{
        roleName
      }
    }
  }
`;

const CHANGE_PASSWORD = gql`
mutation changePassword($data: ChangePasswordInput!)
{
  changePassword(data:$data)
}`;


const PASSWORD_RESET = gql`
  mutation passwordReset($data: ResetPasswordInput!){
    passwordReset(data: $data)
  }
`;

const DELETE_USER = gql`
  mutation deleteUser($id: String!)
  {
    deleteUser(id: $id)
  }
`;

const CREATE_USER = gql`
mutation createUser($data: UserAddInput!)
{
  createUser(data:$data){
        id
    }
}`;

const EDIT_USER = gql`
  mutation editUser($data: UserEditInput!){
    editUser(data: $data)
  }
`;

const USER_LIST = gql`
  query getAllUsers($data: PaginationInput!){
   userList: getAllUsers(data: $data) {
   users{
      id
      firstName
      lastName
      email
      fullName
      mobileNo
      createdOn
      status
      role{
        roleName
      }
    }
      totalRows
    }
  }
`;

const ROLE_LIST = gql`
  query getRoles{
    roles: roles{
      id
      roleName
    }
  }
`;

export {
  CREATE_USER,
  EDIT_USER,
  LOGIN,
  CHANGE_PASSWORD,
  PASSWORD_RESET,
  USER_LIST,
  ROLE_LIST,
  DELETE_USER,
  USER_BY_ID
};
