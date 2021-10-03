import gql from 'graphql-tag';

const getParamGroupList = gql`
  query getGroupParam
  {
    groups:getGroupParam{
        id
        parentId
        name
    }
  }`;

const getDataTypeList = gql`
  query getDataTypeList{
    dataTypes: getSystemDataTypes {
      id
      datatype
    }
  }
`;

const getParamWithDetails = gql`
  query getParamWithDetails($id: Float!, $parentId: Float!){
    details: getParamWithDetails(id: $id) {
    id
    name
    parentId
    isSystem
    isGroup
    details{
      id
      paramCode
      dataTypeId
      description
      script{
        id
      	script
            }
          }
    }

    parent: getParamById(id: $parentId){
      id,
      name
    }
  }`;

const getParamById = gql`
  query getParamById($id: Float!){
    parameter: getParamById(id: $id){
      id,
      name
    }
  }
`;


const getParamValueByParamCode = gql`
  query getParamValueByParamCode($code: String!){
    parameter: getParamValueByParamCode(code: $code){
      id,
      defaultValue
    }
  }
`;

const getChildParam = gql`
  query getChildParam($parentId:Float!){
    childs: getChildParam(parentId: $parentId){
      id
      parentId
      name
      isSystem
      isGroup
      level
    }
  }
`;


const saveParam = gql`
mutation createParam($data: ParamInput!)
{
  createParam(data:$data){
    id
  }
}`;

const deleteParam = gql`
mutation deleteParam($id: Float!){
  deleteParam(id: $id)
}`;


const getParamValues = gql`
  query getParamValues{
    values:getParamValues{
      paramId
      paramCode
      dataTypeId
      defaultValue
    }
  }
`;
const getParamListForDefaultValue = gql`
  query getParamListForDefaultValue
  {
    groups:getParamListForDefaultValue{
        id
        name
        parentId
        isGroup
        details{
            paramCode
            description
            dataTypeId
            selectList{
                id
                text
            }
        defaultValue
        }
    }
  }`;


const updateParamValue = gql`
mutation updateParamValue($data: ParamValueInput!)
{
    updateParamValue(data:$data)
}`;

export {
    getParamGroupList,
    getDataTypeList,
    getChildParam,
    getParamById,
    saveParam,
    getParamWithDetails,
    deleteParam,
    getParamListForDefaultValue,
    updateParamValue,
    getParamValues,
    getParamValueByParamCode
};
