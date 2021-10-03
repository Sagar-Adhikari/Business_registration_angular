import gql from 'graphql-tag';

const getRateGroupList = gql`
query getGroupRates
  {
    groups:getGroupRates{
        id
        parentId
       name: caption
    }
  }
`;

const getRateById = gql`
  query getRateById($id: Float!){
    rate: getRateById(id: $id){
      id,
    name: caption
    parentId
    rate
    capital
    isGroup
    level
    parent{
        id
        name:caption
    }
    }
  }
`;

const getChildRate = gql`
  query getChildRate($parentId:Float!){
    childs: getChildRate(parentId: $parentId){
      id
      parentId
     name: caption
      capital
      rate
      isGroup
      level
    }
  }
`;

const saveRate = gql`
mutation createRate($data: RateInput!)
{
    createRate(data:$data){
    id
  }
}`;


const deleteRate = gql`
mutation deleteRate($id: Float!){
  deleteRate(id: $id)
}`;


export {
    getChildRate,
    getRateById,
    getRateGroupList,
    saveRate,
    deleteRate
};
