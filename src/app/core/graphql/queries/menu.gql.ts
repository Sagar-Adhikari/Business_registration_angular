import gql from 'graphql-tag';


const GET_MENU_GROUP = gql`
  query getGroupMenus($moduleId: number, $menuTypeId: number, $isEnable: boolean)
  {
    getAllSystemModule{
        id,
        moduleName
    }
  }
`;

const GET_ADMIN_MENUS = gql`
  query getAdminMenus {
    adminMenus: getAdminMenus {
      id
      parentId
      caption
      captionNepali
      tips
      tipsNepali
      imageURL
      menuPath{
        path
      }
    }
  }
`;


const MENUS_OF_MODULE = gql`
    query getMenusOfModule($moduleId: Float!){
        menus: getMenusOfModule(moduleId: $moduleId){
            id
            parentId
            caption
            menuTypeId
            imageURL
            level
            menuPath{
                transMenuType
                path
            }
        }
    }
`;
// const GET_COMPANY_TYPE = gql`
//   query getCompanyType
//   {
//     companyType:getCompanyType{
//         id
//         companyType
//     }
//   }`;

export { GET_MENU_GROUP, GET_ADMIN_MENUS, MENUS_OF_MODULE };

