import gql from 'graphql-tag';



const getProductWiseCount = gql`
  query getProductWiseCount{
    product: getProductWiseCount{
      productId
      productName
      count
    }
    pending: getStatusWiseCount{
    count
    status
  }
  }
`;


const getFiscalYearWiseProductCountWithFYList = gql`
  query getFiscalYearWiseProductCountWithFYList($fiscalYear: String!){
    fyList: getFiscalYearList {
       fiscalYear
    }
    graph: getFiscalYearWiseCount(fiscalYear:$fiscalYear){
      productId
      productName
      count
    }
  }
`;


const getMonthWiseProductCountWithFYList = gql`
  query getMonthWiseProductCountWithFYList($fiscalYear: String!){
    fyList: getFiscalYearList {
       fiscalYear
    }
    graph: getMonthWiseCount(fiscalYear:$fiscalYear){
      productId
      productName
      month
      count
    }
  }
`;

const getMonthWiseCount = gql`
  query getMonthWiseCount($fiscalYear: String!){
    graph: getMonthWiseCount(fiscalYear:$fiscalYear){
      productId
      productName
      month
      count
    }
  }
`;

const getFiscalYearCompareRevenue = gql`
  query getFiscalYearCompareRevenue{
    graph: getFiscalYearCompareRevenue{
      productId,
      productName,
      fiscalYear
      countOrRevenue
    }
  }
`;

const getFiscalYearCompareCount = gql`
  query getFiscalYearCompareCount{
    graph: getFiscalYearCompareCount{
      productId,
      productName,
      fiscalYear
      countOrRevenue
    }
  }
`;

const getFiscalYearWiseCount = gql`
  query getFiscalYearWiseCount($fiscalYear: String!){
    graph: getFiscalYearWiseCount(fiscalYear:$fiscalYear){
      productId
      productName
      count
    }
  }
`;


const getFiscalYearWiseProductRevenueWithFYList = gql`
  query getFiscalYearWiseProductRevenueWithFYList($fiscalYear: String!){
    fyList: getFiscalYearList {
       fiscalYear
    }
    graph: getFiscalYearWiseRevenue(fiscalYear:$fiscalYear){
      productId
      productName
      taxRevenue
    }
  }
`;

const getFiscalYearWiseRevenue = gql`
  query getFiscalYearWiseRevenue($fiscalYear: String!){
    graph: getFiscalYearWiseRevenue(fiscalYear:$fiscalYear){
      productId
      productName
      taxRevenue
    }
  }
`;


const getMonthWiseProductRevenueWithFYList = gql`
  query getMonthWiseProductRevenueWithFYList($fiscalYear: String!){
    fyList: getFiscalYearList {
       fiscalYear
    }
    graph: getMonthWiseRevenue(fiscalYear:$fiscalYear){
      productId
      productName
      month
      taxRevenue
    }
  }
`;



const getMonthWiseRevenue = gql`
  query getMonthWiseRevenue($fiscalYear: String!){
    graph: getMonthWiseRevenue(fiscalYear:$fiscalYear){
      productId
      productName
      month
      taxRevenue
    }
  }
`;

export {
    getProductWiseCount,
    getFiscalYearWiseProductCountWithFYList,
    getFiscalYearWiseCount,
    getFiscalYearWiseProductRevenueWithFYList,
    getFiscalYearWiseRevenue,

    getMonthWiseProductCountWithFYList,
    getMonthWiseCount,
    getMonthWiseProductRevenueWithFYList,
    getMonthWiseRevenue,

    getFiscalYearCompareRevenue,
    getFiscalYearCompareCount
};
