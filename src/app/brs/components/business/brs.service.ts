import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as G from '../business/brs.gql';
import { map } from 'rxjs/operators';
import {
  BrsInput,
  PaginationInput,
  Upload,
  BusinessVerifyInput,
  CertificateNoInput,
  WardLocationInput,
  LocationInput,
  NoticeInput
} from 'src/app/generated/graphql';
import { DateFormat, CalendarService } from 'src/app/tools/nepali-calendar';
import { GlobalService } from 'src/app/shared';
import { Parameter } from 'src/app/shared/global.service';

export interface AnnexOutput {
  rateList: any[];
  hasChild: boolean;
  rate: number;
  hasCapital: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BrsService {
  paramValue: Parameter;
  constructor(
    private apollo: Apollo,
    private calender: CalendarService,
    private globalService: GlobalService
  ) {
    this.globalService.parameter$.subscribe(x => {
      this.paramValue = x;
    });
    this.globalService.refreshParameter();
  }

  public getAnnex(id: number) {
    return this.apollo
      .query<any>({
        query: G.getAnnex,
        fetchPolicy: 'network-only',
        variables: { id: id }
      })
      .pipe(
        map(
          (res): any => {
            return res.data.annex;
          }
        )
      );
  }
  public getDefaultDistrictCity(stateId: number, districtId: number) {
    return this.apollo
      .query<any>({
        query: G.getDefaultDistrictCity,
        fetchPolicy: 'network-only',
        variables: { stateId: stateId, districtId: districtId }
      })
      .pipe(
        map(
          (res): any => {
            return {
              cities: res.data.cities,
              districts: res.data.districts
            };
          }
        )
      );
  }
  public getInitialData(id: number) {
    return this.apollo
      .query<any>({
        query: G.getInitialData,
        fetchPolicy: 'network-only',
        variables: { id: id }
      })
      .pipe(
        map(
          (res): any => {
            return {
              annex: res.data.annex,
              states: res.data.states,
              districts: res.data.districts,
              defaultState: res.data.defaultState,
              defaultDistrict: res.data.defaultDistrict,
              defaultCity: res.data.defaultCity,
              palika: res.data.palika
            };
          }
        )
      );
  }

  public getCertificateDetailsOfMemberByBusenessId(id: number) {
    return this.apollo
      .query<any>({
        query: G.getCertificateDetailsByIdOfMember,
        fetchPolicy: 'no-cache',
        variables: { id: id }
      })
      .pipe(
        map(
          (res): any => {
            return res.data;
          }
        )
      );
  }

  public getCertificateDetailsOfBusenessId(id: number) {
    return this.apollo
      .query<any>({
        query: G.getCertificateDetailsById,
        fetchPolicy: 'no-cache',
        variables: { id: id }
      })
      .pipe(
        map(
          (res): any => {
            return res.data;
          }
        )
      );
  }

  public getAnnexRate(id: number, capital: number) {
    return this.apollo
      .query<any>({
        query: G.getAnnexRate,
        fetchPolicy: 'network-only',
        variables: { id: id, capital: capital }
      })
      .pipe(
        map(
          (res): any => {
            return res.data.rate;
          }
        )
      );
  }

  public getStates() {
    return this.apollo
      .query<any>({
        query: G.getStates,
        fetchPolicy: 'network-only'
      })
      .pipe(
        map(
          (res): any => {
            return res.data.states;
          }
        )
      );
  }

  public getDistricts() {
    return this.apollo
      .query<any>({
        query: G.getDistricts,
        fetchPolicy: 'network-only'
      })
      .pipe(
        map(
          (res): any => {
            return res.data.districts;
          }
        )
      );
  }

  public getDistrictByStateId(stateId: number) {
    return this.apollo
      .query<any>({
        query: G.getDistrictByStateId,
        fetchPolicy: 'network-only',
        variables: { stateId: stateId }
      })
      .pipe(
        map(
          (res): any => {
            return res.data.districts;
          }
        )
      );
  }

  public getCityByDistrictId(districtId: number) {
    return this.apollo
      .query<any>({
        query: G.getCityByDistrictId,
        fetchPolicy: 'network-only',
        variables: { districtId: districtId }
      })
      .pipe(
        map(
          (res): any => {
            return res.data.cities;
          }
        )
      );
  }

  public getAllBusiness(
    page?: number,
    size?: number,
    filterArray?: string[],
    sortArray?: any[]
  ) {
    const data: PaginationInput = {
      pageNo: page ? page : 0,
      pageSize: size ? size : 10,
      filter: filterArray ? filterArray : undefined,
      sort: sortArray ? sortArray : undefined
    };
    return this.apollo
      .query<any>({
        query: G.getAllBusiness,
        variables: { data: data },
        fetchPolicy: 'network-only'
      })
      .pipe(
        map(
          (res): any => {
            return res.data.businessList;
          }
        )
      );
  }


  public getAllBusinessForList(
    page?: number,
    size?: number,
    filterArray?: string[],
    sortArray?: any[]
  ) {
    const data: PaginationInput = {
      pageNo: page ? page : 0,
      pageSize: size ? size : 10,
      filter: filterArray ? filterArray : undefined,
      sort: sortArray ? sortArray : undefined
    };
    return this.apollo
      .query<any>({
        query: G.getAllBusinessForList,
        variables: { data: data },
        fetchPolicy: 'network-only'
      })
      .pipe(
        map(
          (res): any => {
            return res.data.businessList;
          }
        )
      );
  }

  public getCertificateNoAndPenalty(id: number, fyId: string, date: Date) {
    const data: CertificateNoInput = {
      id: id,
      fyId: fyId,
      date: date
    };
    return this.apollo
      .query<any>({
        query: G.getCertificateNoAndPenalty,
        variables: { data: data },
        fetchPolicy: 'network-only'
      })
      .pipe(
        map(
          (res): any => {
            return res.data.certificateNoAndPenalty;
          }
        )
      );
  }

  public registerBusiness(data: BrsInput, image?: Upload) {
    return this.apollo
      .mutate({
        mutation: G.registerBusiness,
        variables: {
          data: data,
          image: image
        }
      })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public verifyBusiness(data: BusinessVerifyInput) {
    return this.apollo
      .mutate({
        mutation: G.verifyBusiness,
        variables: {
          data: data
        }
      })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getMember(citizenShipNo: string, districtId: number) {
    return this.apollo
      .query<any>({
        query: G.getMember,
        fetchPolicy: 'no-cache',
        variables: { citizenshipNo: citizenShipNo, districtId: districtId }
      })
      .pipe(
        map(
          (res): any => {
            return res.data.member;
          }
        )
      );
  }
  public getBusiness(id: number) {
    return this.apollo
      .query<any>({
        query: G.getBusiness,
        fetchPolicy: 'network-only',
        variables: { id: id }
      })
      .pipe(
        map(
          (res): any => {
            console.log(res.data);
            return res.data;
          }
        )
      );
  }

  public isValidRedgNo(fYear: string, redgNo: number, wardNo: number) {
    return this.apollo
      .query<any>({
        query: G.isValidRedgNo,
        fetchPolicy: 'no-cache',
        variables: { fYear: fYear, redgNo: redgNo, wardNo: wardNo }
      }).pipe(
        map((res): any => {
          return res.data;
        }
        )
      );
  }

  public getListOfEdit(
    // pStateId: number,
    // pDestrictId: number,
    // tStateId: number,
    // tDestrictId: number,
    hStateId: number,
    hDestrictId: number,
    businessClassId: number,
    businessTypeId: number
  ) {
    return this.apollo
      .query<any>({
        query: G.getListforEdit,
        fetchPolicy: 'no-cache',
        variables: {
          // pStateId: pStateId,
          // pDestrictId: pDestrictId,
          // tStateId: tStateId,
          // tDestrictId: tDestrictId,
          hStateId: hStateId,
          hDestrictId: hDestrictId,
          businessClassId: businessClassId,
          businessTypeId: businessTypeId
        }
      })
      .pipe(
        map(
          (res): any => {
            return res.data;
          }
        )
      );
  }

  public deleteBusiness(id: number) {
    return this.apollo
      .mutate({
        mutation: G.deleteBusiness,
        variables: { id: id }
      })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public markAsPrinted(id: number) {
    return this.apollo
      .mutate({
        mutation: G.markAsPrinted,
        variables: { id: id }
      })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getExpiredDate(dateBS: string, df: DateFormat) {
    let expireOn = new Date();
    if (this.paramValue.IsFiscalYearRenew === true) {
      let year = this.calender.GetBSYear(dateBS, df);
      const month = this.calender.GetBSMonth(dateBS, df);
      if (month <= 3) {
        year = year;
      } else {
        year = year + 1;
      }
      expireOn = this.calender.GetDateAD(
        year,
        3,
        this.calender.GetDaysInMonthBS(year, 3)
      );
    } else {
      expireOn = this.calender.addYearInBS(dateBS, 1, df);
    }
    return expireOn;
  }

  public getWardLocation() {
    const data: PaginationInput = {
      pageNo: 1,
      pageSize: 100
    };
    return this.apollo
      .query<any>({
        query: G.getWardLocation,
        variables: { data: data },
        fetchPolicy: 'network-only'
      })
      .pipe(
        map(
          (res): any => {
            return res.data;
          }
        )
      );
  }

  public setWardLocation(data: WardLocationInput) {
    return this.apollo
      .mutate<any>({
        mutation: G.setWardLocation,
        variables: { data: data }
      })
      .pipe(
        map((res): any => {
          return res.data.setWardLocation;
        })
      );
  }

  public getBusinessLocation() {
    return this.apollo
      .query<any>({
        query: G.getBusinessLocation,
        fetchPolicy: 'network-only',
        variables: {}
      })
      .pipe(
        map(
          (res): any => {
            return res.data.location;
          }
        )
      );
  }

  public getBusinessLocationById(id: number) {
    return this.apollo
      .query<any>({
        query: G.getBusinessLocationById,
        fetchPolicy: 'network-only',
        variables: { id: id }
      })
      .pipe(
        map(
          (res): any => {
            return res.data;
          }
        )
      );
  }

  public getMobileNo(flag: number, type: number) {
    return this.apollo
      .query<any>({
        query: G.getMobileNo,
        fetchPolicy: 'network-only',
        variables: { flag: flag, type: type }
      }).pipe(
        map((res): any => {
          return res.data.mobileList;
        })
      );
  }

  public sendSMS(data: NoticeInput) {
    return this.apollo
      .mutate({
        mutation: G.sendNotice,
        variables: { data: data }
      }).pipe(map(res => {
        return res;
      }));
  }
  public setBusinessLocation(data: LocationInput) {
    return this.apollo
      .mutate({
        mutation: G.setBusinessLocation,
        variables: { data: data }
      })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  public getAllNotice(
    page?: number,
    size?: number,
    filterArray?: string[],
    sortArray?: any[]
  ) {
    const data: PaginationInput = {
      pageNo: page ? page : 0,
      pageSize: size ? size : 10,
      filter: filterArray ? filterArray : undefined,
      sort: sortArray ? sortArray : undefined
    };
    return this.apollo
      .query<any>({
        query: G.getAllNotice,
        variables: { data: data },
        fetchPolicy: 'network-only'
      })
      .pipe(
        map(
          (res): any => {
            return { notices: res.data.notices.notices, totalRows: res.data.notices.totalRows };
          }
        )
      );
  }

  public getAnnex4OrderByCaption() {
    return this.apollo
      .query<any>({
        query: G.getAnnex4OrderByCaption,
        fetchPolicy: 'network-only'
      })
      .pipe(
        map(
          (res): any => {
            return res.data.list;
          }
        )
      );
  }


  public getAllBusinessWithTotal(
    page?: number,
    size?: number,
    filterArray?: string[],
    sortArray?: any[]
  ) {
    const data: PaginationInput = {
      pageNo: page ? page : 0,
      pageSize: size ? size : 10,
      filter: filterArray ? filterArray : undefined,
      sort: sortArray ? sortArray : undefined
    };
    return this.apollo
      .query<any>({
        query: G.getAllBusinessWithTotal,
        variables: { data: data },
        fetchPolicy: 'network-only'
      })
      .pipe(
        map(
          (res): any => {

            const body: any = [];
            const headings: any = [];
            const displayColumns: any = [];



            const total = {
              totalCapital: res.data.businessList.totalCapital,
              totalEmploymentDirect: res.data.businessList.totalEmploymentDirect,
              totalEmploymentInDirect: res.data.businessList.totalEmploymentInDirect,
              totalPenalty: res.data.businessList.totalPenalty,
              totalRate: res.data.businessList.totalRate,
              totalRows: res.data.businessList.totalRows,
              totalTurnOver: res.data.businessList.totalTurnOver
            };
            displayColumns.push(
              ['RedgNo',
                'BusinessNameNepali)',
                'BusinessNameEnglish',
                'BusinessPanNo',
                'BusinessRedgNo',
                'BusinessTyoe',
                'WorkingCapital',
                'RunningCapital',
                'TotalCapital',
                'TurnOver',
                'DirectEmp',
                'InDirectEmp',
                'IssuedPerson',
                'HouseOwner',
                'HouseRent',
                'Frequency',
                'OfficeAddress',
                'MemberNameNepali',
                'MemberNameEnglish',
                'CitizenNo',
                'CitizenDate',
                'CitizenDistrict',
                'MemberPanNo',
                'MobileNo',
                'PhoneNo',
                'Email',
                'FatherName',
                'MotherName',
                'GFNAme',
                'PAddress',
                'TAddress',
                'Rate',
                'Remarks',
                'IssuedDate',
                'ExpiredDate',
                'Status'
              ]);



            headings.push(
              ['दर्ता नं.',
                'ब्यवसायकाे नाम (नेपालीमा)',
                'ब्यवसायकाे नाम (अंग्रेजीमा)',
                'प्यान नं',
                'दर्ता मिति',
                'ब्यवसायकाे किसिम',
                'चालु पँजी',
                'स्थिर',
                'जम्मा पुँजी',
                'क्षमता',
                'प्रत्यक्ष राेजगार',
                'अप्रत्यक्ष राेजगार',
                'प्रमाणित गर्ने',
                'घर बेटी',
                'घर भाडा',
                'भाडा बुझाउने',
                'कार्यालय ठेगाना',
                'ब्यवसायीकाे नाम (नेपालीमा)',
                'ब्यवसायीकाे नाम (अंग्रेजीमा)',
                'नागरीकता नं',
                'नागरीकता जारी मिति',
                'नागरीकता जारी गर्ने जिल्ला',
                'ब्यवसायीकाे प्यान नं',
                'माेबाइल नं',
                'फाेन नं',
                'इमेल',
                'बुबाकाे नाम',
                'अामाकाे नाम',
                'हजुरबुबाकाे नाम',
                'स्थायी ठेगाना',
                'अस्थायी ठेगाना',
                'शुल्क',
                'कैफियत',
                'जारी मिति',
                'भाखा नाघ्ने मिति',
                'स्टाटस'
              ]);

            const temp = res.data.businessList.business;


            if (temp) {
              for (let i = 0; i < temp.length; i++) {
                let businessType = temp[i].businessClass.caption + ', ' + temp[i].businessType.caption;
                if (temp[i].businessSize) {
                  businessType = businessType + ', ' + temp[i].businessSize.caption;
                }
                body.push(
                  [temp[i].fullRedgNo,
                  temp[i].businessName,
                  temp[i].businessNameEnglish,
                  temp[i].panNo,
                  this.globalService.getShortDateWithoutTime(temp[i].redgDate),
                    businessType,
                  temp[i].workingCapital,
                  temp[i].currentCapital,
                  temp[i].totalCapital,
                  temp[i].turnOver,
                  temp[i].employmentDirect,
                  temp[i].employmentIndirect,
                  temp[i].issuedPersonName,
                  temp[i].houseOwners[0].name,
                  temp[i].houseOwners[0].monthlyRent,
                  temp[i].houseOwners[0].rentFrequency,
                  'प्रदेशः' + temp[i].houseOwners[0].municipality.district.state.stateName +
                  ', जिल्लाः ' + temp[i].houseOwners[0].municipality.district.districtName +
                  ', पालिकाः ' + temp[i].houseOwners[0].municipality.municipalityName +
                  ', वार्ड नंः ' + temp[i].houseOwners[0].wardNo +
                  ', सडकः ' + temp[i].houseOwners[0].street +
                  ', टाेलः ' + temp[i].houseOwners[0].tole +
                  ', घर नंः ' + temp[i].houseOwners[0].houseNo,
                  temp[i].member.nameInNepali,
                  temp[i].member.nameInEnglish,
                  temp[i].member.citizenShipNo,
                  this.globalService.getShortDateWithoutTime(temp[i].member.citizenShipIssueDate),
                  temp[i].member.citizenShipDistrict.districtName,
                  temp[i].member.panNo,
                  temp[i].member.mobileNo,
                  temp[i].member.phoneNo,
                  temp[i].member.email,
                  temp[i].member.fathersName,
                  temp[i].member.mothersName,
                  temp[i].member.grandFathersName,

                  'प्रदेशः ' + temp[i].member.memberAddresses[0].municipality.district.state.stateName +
                  ', जिल्लाः ' + temp[i].member.memberAddresses[0].municipality.district.districtName +
                  ', पालिकाः ' + temp[i].member.memberAddresses[0].municipality.municipalityName +
                  ', वार्ड नंः ' + temp[i].member.memberAddresses[0].wardNo +
                  ', टाेलः ' + temp[i].member.memberAddresses[0].tole +
                  ', घर नंः ' + temp[i].member.memberAddresses[0].houseNo,

                  'प्रदेशः ' + temp[i].member.memberAddresses[1].municipality.district.state.stateName +
                  ', जिल्लाः ' + temp[i].member.memberAddresses[1].municipality.district.districtName +
                  ', पालिकाः ' + temp[i].member.memberAddresses[1].municipality.municipalityName +
                  ', वार्ड नंः ' + temp[i].member.memberAddresses[1].wardNo +
                  ', टाेलः ' + temp[i].member.memberAddresses[1].tole +
                  ', घर नंः ' + temp[i].member.memberAddresses[1].houseNo,
                  temp[i].rate,
                  temp[i].remarks,
                  this.globalService.getShortDateWithoutTime(temp[i].verificationDate),
                  this.globalService.getShortDateWithoutTime(temp[i].expireOn),
                  temp[i].status
                  ]);
              }
            }
            return { headings, body, displayColumns, total };
          })
      );
  }
}
