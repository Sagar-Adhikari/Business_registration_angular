import gql from 'graphql-tag';

const getAnnex = gql`
  query getAnnex($id: Float!) {
    annex: getAnnex(id: $id) {
      rate
      rateList {
        id
        caption
      }
      hasChild
      hasCapital
    }
  }
`;
const getDefaultDistrictCity = gql`
  query getDefaultDistrictCity($districtId: Float!, $stateId: Float!) {
    districts: getDistrictByStateId(stateId: $stateId) {
      id
      districtName
    }
    cities: getCityByDistrictId(districtId: $districtId) {
      id
      city: municipalityName
    }
  }
`;
const getInitialData = gql`
  query getAnnex($id: Float!) {
    annex: getAnnex(id: $id) {
      rate
      rateList {
        id
        caption
      }
      hasChild
      hasCapital
    }

    states: getStates {
      id
      stateName
    }

    districts: getDistricts {
      id
      districtName
    }

    palika: palikas(page:{pageNo:1, pageSize:1}){
      id
      lat
      lng
    }
    defaultState: getParamValueByParamCode(code: "00018") {
      defaultValue
    }

    defaultDistrict: getParamValueByParamCode(code: "00019") {
      defaultValue
    }

    defaultCity: getParamValueByParamCode(code: "00020") {
      defaultValue
    }
  }
`;

const getAnnexRate = gql`
  query getAnnexRate($id: Float!, $capital: Float!) {
    rate: getAnnexRate(id: $id, capital: $capital)
  }
`;

const getParamValueByParamCode = gql`
  query getParamValueByParamCode {
    defaultCityVillage: getParamValueByParamCode {
      id
    }
  }
`;

const getDistricts = gql`
  query getDistricts {
    districts: getDistricts {
      id
      districtName
    }
  }
`;


const getStates = gql`
  query getStates {
    states: getStates {
      id
      stateName
    }
  }
`;

const getDistrictByStateId = gql`
  query getDistrictByStateId($stateId: Float!) {
    districts: getDistrictByStateId(stateId: $stateId) {
      id
      districtName
    }
  }
`;

const getCityByDistrictId = gql`
  query getCityByDistrictId($districtId: Float!) {
    cities: getCityByDistrictId(districtId: $districtId) {
      id
      city: municipalityName
    }
  }
`;

const getCertificateNoAndPenalty = gql`
  query getCertificateNoAndPenalty($data: CertificateNoInput!) {
    certificateNoAndPenalty: getCertificateNoAndPenalty(data: $data) {
      certificateNumber
      penalty
      totalYear
    }
  }
`;



const getListforEdit = gql`
  query list(
    # $pStateId: Float!
    # $pDestrictId: Float!
    # $tStateId: Float!
    # $tDestrictId: Float!
    $hStateId: Float!
    $hDestrictId: Float!
    $businessClassId: Float!
    $businessTypeId: Float!
  ) {
    # pdistricts: getDistrictByStateId(stateId: $pStateId) {
    #   id
    #   districtName
    # }
    # pcities: getCityByDistrictId(districtId: $pDestrictId) {
    #   id
    #   city: municipalityName
    # }
    # tdistricts: getDistrictByStateId(stateId: $tStateId) {
    #   id
    #   districtName
    # }
    # tcities: getCityByDistrictId(districtId: $tDestrictId) {
    #   id
    #   city: municipalityName
    # }
    hdistricts: getDistrictByStateId(stateId: $hStateId) {
      id
      districtName
    }
    hcities: getCityByDistrictId(districtId: $hDestrictId) {
      id
      city: municipalityName
    }
    businessType: getAnnex(id: $businessClassId) {
      rate
      rateList {
        id
        caption
      }
      hasChild
      hasCapital
    }
    businessSize: getAnnex(id: $businessTypeId) {
      rate
      rateList {
        id
        caption
      }
      hasChild
      hasCapital
    }
  }
`;
const getMember = gql`
  query getMember($districtId: Float!, $citizenshipNo: String!){
   member: getMember(citizenshipNo: $citizenshipNo, districtId: $districtId) {
    id
    citizenShipNo
    citizenShipDistrictId
    citizenShipIssueDate
    nameInNepali
    nameInEnglish
    panNo
    phoneNo
    mobileNo
    faxNo
    email
    fathersName
    mothersName
    grandFathersName
    photoURL
    memberAddresses {
      id
      tole
      wardNo
      houseNo
      addressType
      municipality {
         id
        district{
           id
           stateId
        }
      }
    }
  }
  }
`;

const isValidRedgNo = gql`
  query isValidRedgNo($fYear: String!, $redgNo:Float!, $wardNo: Float!){
    isValidRedgNo(fYear:$fYear, redgNo:$redgNo, wardNo:$wardNo)
  }
`;
const getBusiness = gql`
  query getBusiness($id: Float!) {
    business:  getBusiness(id: $id) {
    id
    memberId
    businessClassId
    businessTypeId
    businessSizeId
    businessName
    businessNameEnglish
    panNo
    redgDate
    currentCapital
    workingCapital
    totalCapital
    rate
    turnOver
    employmentDirect
    employmentIndirect
    remarks
    createrId
    createdOn
    verifierId
    verifiedOn
    fYear
    printedOn
    issuedPersonName
    redgNo
    status
    applicationFee
    registrationFee
    penaltyFee
    expireOn
    verificationDate
    month
    totalAmount
    fullRedgNo
    lastRenewDate
    member {
      id
      citizenShipNo
      citizenShipDistrictId
      citizenShipIssueDate
      nameInNepali
      nameInEnglish
      phoneNo
      mobileNo
      faxNo
      email
      fathersName
      mothersName
      grandFathersName
      photoURL
      memberAddresses {
        id
        tole
        wardNo
        houseNo
        addressType
        municipality {
          id
          district {
            id
            stateId
          }
        }
      }
    }
    houseOwners {
      id
      name
      monthlyRent
      rentFrequency
      municipality {
        id
        district {
          id
           stateId
        }
      }
      tole
      street
      houseNo
      wardNo
    }
    otherBusinesses {
      id
      otherBusinessType
      otherBusinessNo
      otherBusinessRedgDate
    }
    maps{
      id
      lat
      lng
    }
    otherRegistrations {
      id
      otherRedgNo
      otherRedgOffice
      redgDate
    }
    vehicles {
      id
      vehicleRedgNo
      vehicleRedgDate
      vehicleTax
    }
  }
  }
`;

const deleteBusiness = gql`
  mutation deleteBusiness($id: Float!) {
    deleteBusiness(id: $id)
  }
`;


const markAsPrinted = gql`
  mutation markAsPrinted($id: Float!) {
    markAsPrinted(id: $id)
  }
`;


const getCertificateDetailsByIdOfMember = gql`
  query getCertificateDetailsByIdOfMember($id: Float!) {
    certificate: getCertificateDetailsByIdOfMember(id: $id) {
    id
    nameInNepali
    nameInEnglish
    citizenShipNo
    citizenShipIssueDate
    mobileNo
    faxNo
    email
    panNo
    fathersName
    mothersName
    grandFathersName
    photoURL
    citizenShipDistrict {
      id
      districtName
    }
    memberAddresses {
      id
      tole
      houseNo
      wardNo
      municipality {
        id
        municipalityName
        district {
          id
          districtName
          state {
            id
            stateName
          }
        }
      }
    }
    businesses {
      id
      businessName
      businessNameEnglish
      redgNo
      redgDate
      currentCapital
      workingCapital
      totalCapital
      fullRedgNo
      rate
      turnOver
      employmentDirect
      employmentIndirect
      verifiedOn
      verificationDate
      fYear
      issuedPersonName
      panNo
      houseOwners {
        id
        tole
        houseNo
        wardNo
        street
        municipality {
          id
          municipalityName
          district {
            id
            districtName
            state {
              id
              stateName
            }
          }
        }
      }
      businessClass {
        id
        caption
      }
      businessType {
        id
        caption
      }
      businessSize {
        id
        caption
      }
      otherRegistrations {
        id
        otherRedgOffice
        otherRedgNo
        redgDate
      }
    }
  }
  }
`;

const getCertificateDetailsById = gql`
  query getCertificateDetailsById($id: Float!) {
    certificate: getCertificateDetailsById(id: $id){
    id
    businessName
    businessNameEnglish
    redgNo
    redgDate
    currentCapital
    workingCapital
    totalCapital
    fullRedgNo
    rate
    turnOver
    employmentDirect
    employmentIndirect
    verifiedOn
    verificationDate
    fYear
    issuedPersonName
    panNo
    houseOwners{
      id
      tole
      houseNo
      wardNo
      street
      municipality{
        id
        municipalityName
        district{
          id
          districtName
          state{
            id
            stateName
          }
        }
      }
    }
    businessClass{
      id
      caption
    }
    businessType{
      id
      caption
    }
    businessSize{
      id
      caption
    }
    member{
      id
      nameInNepali
      nameInEnglish
      citizenShipNo
      citizenShipIssueDate
      mobileNo
      faxNo
      email
      panNo
      fathersName
      mothersName
      grandFathersName
      photoURL
      citizenShipDistrict{
        id
        districtName
      }
      memberAddresses{
        id
        tole
        houseNo
        wardNo
        municipality{
          id
          municipalityName
          district{
            id
            districtName
            state{
              id
              stateName
            }
          }
        }
      }
    }
    otherRegistrations{
      id
      otherRedgOffice
      otherRedgNo
      redgDate
    }
  }
  }
`;

const getAllBusiness = gql`
  query getAllBusiness($data: PaginationInput!) {
    businessList: getAllBusiness(data: $data) {
      totalRows
      business{
        id
        redgNo
        fullRedgNo
        businessName
        businessNameEnglish
        workingCapital
        currentCapital
        totalCapital
        status
        createdOn
        houseOwners{
          id
          name
          municipality{
            id
            municipalityName
            district{
              id
              districtName
              state{
                id
                stateName
              }
            }
          }
        }
        businessClass{
          caption
          id
        }
        businessType{
          id
          caption
        }
        businessSize{
          id
          caption
        }
        member{
          id
          nameInNepali
          nameInEnglish
          citizenShipNo
          citizenShipIssueDate
          citizenShipDistrict{
            id
            districtName
          }
          memberAddresses{
            id
            addressType
            tole
            houseNo
            wardNo
            municipality{
              id
              municipalityName
              district{
                id
                districtName
                state{
                  id
                  stateName
                }
              }
            }
          }
        }
      }
    }
  }
`;


const getAllBusinessForList = gql`
  query getAllBusinessForList($data: PaginationInput!) {
    businessList: getAllBusinessForList(data: $data) {
      totalRows
      business{
        id
        redgNo
        fullRedgNo
        businessName
        businessNameEnglish
        workingCapital
        currentCapital
        totalCapital
        status
        createdOn
        houseOwners{
          id
          name
        }
        businessClass{
          caption
          id
        }
        businessType{
          id
          caption
        }
        businessSize{
          id
          caption
        }
        member{
          id
          nameInNepali
          nameInEnglish
          citizenShipNo
          citizenShipIssueDate
        }
      }
    }
  }
`;
const verifyBusiness = gql`
  mutation verifyBusiness($data: BusinessVerifyInput!) {
    verifyBusiness(data: $data) {
      id
    }
  }
`;

const registerBusiness = gql`
  mutation registerBusiness($data: BrsInput!, $image: Upload) {
    registerBusiness(data: $data, image: $image) {
      id
    }
  }
`;

const getWardLocation = gql`
  query  wards($data: PaginationInput!){
      palikaLocation: palikas(page: $data) {
        id
        lat
        lng
        palikaName
        telNo
      }
      wardLocation: wards(page: $data) {
        id
        lat
        lng
        telNo
      }
    }
  `;

const setWardLocation = gql`
  mutation setWardLocation($data: WardLocationInput!) {
    setWardLocation(data:$data)
  }
`;

const getBusinessLocation = gql`
 query getBusinessLocation {
    location: getBusinessLocation {
      id
    lat
    lng
    business{
      id
      fullRedgNo
    }
  }
}`;

const getBusinessLocationById = gql`
  query getBusinessLocationById($id: Float!) {
    location: getBusinessLocationById(id: $id) {
      id
    lat
    lng
    business{
      id
      fullRedgNo
    }
    }
    }`;

const getMobileNo = gql`
  query getMobileNo($type: Float!, $flag: Float!){
    mobileList: getMobileNo(flag: $flag, type: $type){
      id
      nameInNepali
      mobileNo
      businesses {
        id
        businessName
      }
    }
  }
`;
const setBusinessLocation = gql`
    mutation setBusinessLocation($data: LocationInput!) {
         setBusinessLocation(data:$data)
  }`;

const sendNotice = gql`
  mutation setNotice($data: NoticeInput!){
    setNotice(data: $data){
      id
    }
  }
`;


const getAllNotice = gql`
  query  getAllNotice($data: PaginationInput!){
      notices: getAllNotice(data:$data){
      notices{
        id
        message
        title
        createdOn
        noticeTo{
          id
          mobileNo
          business{
            id
            businessName
            member{id
            nameInNepali}
          }
        }
      }
      totalRows
    }
    }
  `;


const getAllBusinessWithTotal = gql`
query getAllBusinessWithTotal($data: PaginationInput!) {
  businessList: getAllBusinessWithTotal(data: $data) {
    totalRows
    totalRate
    totalCapital
    totalPenalty
    totalTurnOver
    totalEmploymentDirect
    totalEmploymentInDirect
    business {
      id
      fullRedgNo
      businessName
      businessNameEnglish
      panNo
      redgDate
      businessClass {
        caption
        id
      }
      businessType {
        id
        caption
      }
      businessSize {
        id
        caption
      }
      workingCapital
      currentCapital
      totalCapital
      turnOver
      employmentDirect
      employmentIndirect
      issuedPersonName
      houseOwners{
        id
        name
        monthlyRent
        rentFrequency
        municipality{
          id
          municipalityName
          district{
            id
            districtName
            state{
              id
              stateName
            }
          }
        }
        wardNo
        street
        tole
        houseNo
      }
      member{
        id
        nameInNepali
        nameInEnglish
        citizenShipNo
        citizenShipIssueDate
        citizenShipDistrict{
          id
          districtName
        }
        panNo
        mobileNo
        phoneNo
        email
        fathersName
        mothersName
        grandFathersName
        memberAddresses{
          id
          addressType
          municipality{
            id
            municipalityName
            district{
              id
              districtName
              state{
                id
                stateName
              }
            }
          }
          wardNo
          tole
          houseNo
        }
      }
      rate
      remarks
      createdOn
      verificationDate
      expireOn
      status
    }
  }
}
`;

const getAnnex4OrderByCaption = gql`
  query getAnnex4OrderByCaption{
    list: getAnnex4OrderByCaption{
      id
      caption
    }
  }
`;

export {
  getInitialData,
  getAnnex,
  getParamValueByParamCode,
  getAnnexRate,
  getDistricts,
  getStates,
  getDistrictByStateId,
  deleteBusiness,
  getCityByDistrictId,
  registerBusiness,
  getCertificateDetailsById,
  getCertificateDetailsByIdOfMember,
  getAllBusiness,
  getBusiness,
  getListforEdit,
  verifyBusiness,
  getCertificateNoAndPenalty,
  getDefaultDistrictCity,
  markAsPrinted,
  getMember,
  isValidRedgNo,
  getWardLocation,
  setWardLocation,
  getBusinessLocation,
  getBusinessLocationById,
  setBusinessLocation,
  getAllBusinessForList,
  getMobileNo,
  sendNotice,
  getAllNotice,
  getAllBusinessWithTotal,
  getAnnex4OrderByCaption
};
