import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { BrsService, AnnexOutput } from '../business/brs.service';
import { environment } from 'src/environments/environment.prod';
import {
  IDatePickerOption,
  CalendarService,
  DateFormat
} from 'src/app/tools/nepali-calendar';
import { GlobalService } from 'src/app/shared';
import { icon, Map, marker, Marker, tileLayer, latLng } from 'leaflet';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import {
  BrsInput,
  MemberInput,
  MemberAddressInput,
  HouseOwnerInput,
  Upload,
  OtherRedgInput,
  BusinessVerifyInput,
  MapInput
} from 'src/app/generated/graphql';
import { Parameter } from 'src/app/shared/global.service';


declare let L: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  @Output() buttonClicked: EventEmitter<any> = new EventEmitter();
  @ViewChild('stepper') stepper: MatStepper;
  paramValue: Parameter;
  formGroup: FormGroup;

  formType = 'add';
  isOld = false;
  redgId: number;
  private memberId: number;
  private perAddId: number;
  private temAddId: number;
  private houseAddId: number;
  private otherRedgId: number;
  private mapId: number;


  private iconPath = environment.icon_image_path + 'photo/p/';

  private selectedFile = null;

  private expireOn: any;
  private defaultStateId: string;
  private defaultDistrictId: string;
  private defaultCityId: string;
  private defaultDistrictList = [];
  private defaultCityList = [];

  private lat = 27.706612;
  private lng = 85.369930;

  private oldRedgNo = '';
  imgUrl: any = this.iconPath + 'default.jpg';
  pageTitle = '';

  paymentMode = [
    { id: 'मासिक', text: 'मासिक' },
    { id: 'त्रैमासकि', text: 'त्रैमासकि' },
    { id: 'अर्धबार्षकि', text: 'अर्धबार्षकि' },
    { id: 'बार्षिक', text: 'बार्षिक' }
  ];

  rentFrequencyList = [];
  districtListForCitizenship = [];

  stateList = [];
  districtListP = [];
  cityListP = [];

  districtListT = [];
  cityListT = [];

  districtListH = [];
  cityListH = [];

  businessClassAnnex: AnnexOutput = {
    hasCapital: false,
    rateList: [],
    hasChild: false,
    rate: 0
  };

  businessTypeAnnex: AnnexOutput = {
    hasCapital: false,
    rateList: [],
    hasChild: false,
    rate: 0
  };
  businessSizeAnnex: AnnexOutput = {
    hasCapital: false,
    rateList: [],
    hasChild: false,
    rate: 0
  };

  hasBusinessSize = false;

  citizenShipNoValueChanged = new Subject<any>();
  registrationNoChanged = new Subject<any>();

  dpOption: IDatePickerOption;
  dpOptionCitizen: IDatePickerOption;
  dpOptionOtherRedg: IDatePickerOption;
  dpOptionLastRenew: IDatePickerOption;
  dpOptionVerifiedDate: IDatePickerOption;
  get formArray(): AbstractControl | null {
    return this.formGroup.get('formArray');
  }

  allowApplicationFee = true;
  allowRegistrationFee = true;
  allowPenalty = true;

  //#region leaflet
  private map: Map;

  private marker: Marker;


  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  options: any = {
    layers: [this.streetMaps],
    zoom: 13,
    center: latLng([this.lat, this.lng])
  };

  onMapReady(map: Map) {
    this.map = map;
    setTimeout(function () {
      map.invalidateSize();

    }, 200);
    this.AddMarker();
  }

  private createIcon() {
    return icon({
      iconSize: [16, 16],
      iconAnchor: [8, 16],
      iconUrl: 'assets/map/saved-location-marker.png'
    });
  }

  private AddMarker() {
    this.marker = L.marker(
      [this.lat ? this.lat : 0, this.lng ? this.lng : 0], {
      title: 'ब्यवसायकाे लाेकेसन',
      icon: this.createIcon(),
      draggable: true
    })
      .addTo(this.map)
      .on('dragend', e => {
        // const id = +e.target.options.title.toString().substr(10);
        // console.log(this.marker.getLatLng());
        // console.log(e.target);
        // this.markers.latLng = [e.target._latlng.lat, e.target._latlng.lng];
      });
  }


  //#endregion

  constructor(private formBuilder: FormBuilder,
    private brsService: BrsService,
    private globalService: GlobalService,
    private calendar: CalendarService) {
    this.globalService.refreshParameter();
    this.globalService.parameter$.subscribe(x => {
      this.allowApplicationFee = x.AllowApplicationFee;
      this.allowRegistrationFee = x.AllowRegistrationFee;
      this.allowPenalty = x.AllowPenalty;
      this.paramValue = x;
    });


    this.setDateOption();

    this.brsService.getInitialData(1).subscribe(x => {
      this.businessClassAnnex = x.annex;
      this.stateList = x.states;
      this.districtListForCitizenship = x.districts;
      this.defaultStateId = x.defaultState.defaultValue;
      this.defaultCityId = x.defaultCity.defaultValue;
      this.defaultDistrictId = x.defaultDistrict.defaultValue;
      if (x.palika.length > 0) {
        this.lat = x.palika[0].lat;
        this.lng = x.palika[0].lng;
      }
      this.brsService
        .getDefaultDistrictCity(+this.defaultStateId, +this.defaultDistrictId)
        .subscribe(y => {
          this.defaultCityList = y.cities;
          this.defaultDistrictList = y.districts;
        });
    });

    this.citizenShipNoValueChanged.pipe(
      debounceTime(500),
      distinctUntilChanged())
      .subscribe(x => {
        const districtId = +this.formArray.get([0]).get('citizenShipDistrictId').value;
        const citizenshipNo = x;
        if (districtId > 0) {
          this.getMember(citizenshipNo, districtId);
        } else {
          this.clearMemberValue();
        }
      });

    this.registrationNoChanged.pipe(
      debounceTime(800),
      distinctUntilChanged())
      .subscribe(x => {
        const fYear = this.formArray.get([2]).get('fiscalYear').value;
        const wardNo = +this.formArray.get([1]).get('houseOwner').get('wardNo').value;
        const redgNo = x ? +x : 0;
        if (fYear && wardNo) {
          this.brsService.isValidRedgNo(fYear, redgNo, wardNo).subscribe(y => {
            if (y.isValidRedgNo === false) {
              this.globalService.showErrorMessage('डुप्लिकेन दर्ता नम्बर', 1000);
              this.formArray.get([2]).get('redgNo').setValue('');
            }
          });
        }
      });




    this.dpOptionOtherRedg.required = false;

  }

  ngOnDestroy() {
    this.citizenShipNoValueChanged.unsubscribe();
    this.registrationNoChanged.unsubscribe();
  }

  setDateOption() {
    this.dpOption = this.globalService.getDatePickerOption;
    this.dpOptionOtherRedg = this.globalService.getDatePickerOption;
    this.dpOptionCitizen = this.globalService.getDatePickerOption;
    this.dpOptionVerifiedDate = this.globalService.getDatePickerOption;
    this.dpOptionLastRenew = this.globalService.getDatePickerOption;

    this.dpOption.placeholder = 'शुरू गरेकाे मिति';
    this.dpOptionCitizen.placeholder = 'नागरीकता पाएकाे मिति';
    this.dpOptionOtherRedg.placeholder = 'अन्य निकायमा दर्ता मिति';
    this.dpOptionVerifiedDate.placeholder = 'दर्ता मिति';
    this.dpOptionLastRenew.placeholder = 'अन्तिम नबिकरण गरेकाे मिति';
    this.dpOption.maxDate = new Date();
    this.dpOptionCitizen.maxDate = new Date();
    this.dpOptionLastRenew.maxDate = new Date();
    this.dpOptionOtherRedg.maxDate = new Date();
    this.dpOptionVerifiedDate.maxDate = new Date();

  }

  setDateValue() {
    let citizenShipDate = new Date(
      1950,
      new Date().getMonth(),
      new Date().getDate()
    );

    this.formArray.get([1]).get('redgDate').setValue(citizenShipDate);
    this.formArray.get([0]).get('citizenShipIssueDate').setValue(citizenShipDate);
    //  this.formArray.get([1]).get('otherRegistration').get('redgDate').setValue(citizenShipDate);

    const date = new Date();
    citizenShipDate = new Date(
      new Date().getFullYear() - 16,
      new Date().getMonth(),
      new Date().getDate()
    );

    setTimeout(() => {
      this.formArray.get([1]).get('redgDate').setValue(date);
      this.formArray.get([0]).get('citizenShipIssueDate').setValue(citizenShipDate);
      this.formArray.get([1]).get('otherRegistration').get('redgDate').setValue(null);
    }, 100);
  }
  ngOnInit() {
    const citizenShipDate = new Date(
      new Date().getFullYear() - 16,
      new Date().getMonth(),
      new Date().getDate()
    );
    this.formGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          citizenShipNo: ['', Validators.required],
          citizenShipDistrictId: ['', Validators.required],
          citizenShipIssueDate: [citizenShipDate],
          nameInNepali: ['', Validators.required],
          nameInEnglish: ['', Validators.required],
          panNo: ['', Validators.compose([Validators.min(100000000), Validators.max(999999999)])],
          phoneNo: ['', Validators.required],
          mobileNo: ['', Validators.compose([Validators.required, Validators.min(9800000000), Validators.max(9899999999)])],
          email: [''],
          fathersName: [''],
          mothersName: [''],
          grandFathersName: [''],
          permanentAddress: this.formBuilder.group({
            stateId: ['', Validators.required],
            districtId: ['', Validators.required],
            cityId: ['', Validators.required],
            wardNo: ['', Validators.required],
            tole: ['', Validators.required],
            houseNo: ['', Validators.required],
          }),
          temporaryAddress: this.formBuilder.group({
            stateId: ['', Validators.required],
            districtId: ['', Validators.required],
            cityId: ['', Validators.required],
            wardNo: ['', Validators.required],
            tole: ['', Validators.required],
            houseNo: ['', Validators.required],
          }),
        }),
        this.formBuilder.group({
          isOld: [''],
          businessClassId: ['', Validators.required],
          businessTypeId: ['', Validators.required],
          businessSizeId: [''],
          businessName: ['', Validators.required],
          businessNameEnglish: ['', Validators.required],
          redgDate: [new Date()],
          panNo: ['', Validators.compose([Validators.min(100000000), Validators.max(999999999)])],
          currentCapital: ['', Validators.required],
          workingCapital: ['', Validators.required],
          rate: ['', Validators.required],
          turnOver: ['0', Validators.required],
          employmentDirect: ['0', Validators.required],
          employmentIndirect: ['0', Validators.required],
          remarks: [''],
          houseOwner: this.formBuilder.group({
            houseOwnerName: ['', Validators.required],
            stateId: ['', Validators.required],
            districtId: ['', Validators.required],
            cityId: ['', Validators.required],
            wardNo: ['', Validators.required],
            tole: ['', Validators.required],
            street: [''],
            houseNo: ['', Validators.required],
            monthlyRent: ['', Validators.required],
            rentFrequency: ['', Validators.required]
          }),
          otherRegistration: this.formBuilder.group({
            otherRedgOffice: [''],
            otherRedgNo: [''],
            redgDate: ['']
          }),
        }),
        this.formBuilder.group({
          fiscalYear: ['', Validators.required],
          redgNo: ['', Validators.required],
          issuedPersonName: ['', Validators.required],
          applicationFee: ['0', Validators.compose([Validators.required, Validators.min(0)])],
          registrationFee: ['0', Validators.compose([Validators.required, Validators.min(0)])],
          penaltyFee: ['0', Validators.compose([Validators.required, Validators.min(0)])],
          businessTax: ['0', Validators.compose([Validators.required, Validators.min(0)])],
          verifiedDate: [new Date(), Validators.required],
          totalAmount: ['0'],
          lastRenewDate: [new Date(), Validators.required],
        }),
        this.formBuilder.group({
          lat: [''],
          lng: ['']
        }),
      ])
    });
    //  this.setDateValue();

  }

  businessSizeRequired(flag: boolean) {
    if (flag) {
      this.formArray.get([1]).get('businessSizeId').setValidators([Validators.required]);
      this.formArray.get([1]).get('businessSizeId')
        .setValidators([Validators.required]);
    } else {
      this.formArray.get([1]).get('businessSizeId').clearValidators();
    }
    this.formArray.get([1]).get('businessSizeId').updateValueAndValidity();
  }

  businessTypeChanged(flag: any) {
    // debugger;
    this.globalService.setLoading(true);
    this.formArray.get([1]).get('workingCapital').setValue(0);
    this.formArray.get([1]).get('currentCapital').setValue(0);
    if (flag === 1) {
      const classId = +this.formArray.get([1]).get('businessClassId').value;
      this.formArray.get([1]).get('businessTypeId').setValue(null);
      this.businessSizeRequired(false);
      this.brsService.getAnnex(classId).subscribe(x => {
        this.businessTypeAnnex = x;
        this.hasBusinessSize = false;
        this.formArray.get([1]).get('rate').setValue(x.rate);
        this.globalService.setLoading(false);
      });
    } else if (flag === 2) {
      const classId = +this.formArray.get([1]).get('businessTypeId').value;
      this.formArray.get([1]).get('businessSizeId').setValue(null);
      this.brsService.getAnnex(classId).subscribe(x => {
        this.businessSizeAnnex = x;
        this.hasBusinessSize = x.hasChild;
        this.businessSizeRequired(x.hasChild);
        this.formArray.get([1]).get('rate').setValue(x.rate);
        this.globalService.setLoading(false);
      });
    } else if (flag === 3) {
      const classId = +this.formArray.get([1]).get('businessSizeId').value;
      this.brsService.getAnnex(classId).subscribe(x => {
        this.formArray.get([1]).get('rate').setValue(x.rate);
        this.globalService.setLoading(false);
      });
    }
  }

  // onBoardLengthChange(ev: any) {
  //   const length = +ev;
  //   const width = +this.formGroup.controls.boardWidth.value;
  // }
  // onBoardWidthChange(ev: any) {
  //   const length = +this.formGroup.controls.boardLength.value;
  //   const width = +ev;
  //   this.formGroup.controls['boardArea'].setValue(length * width);
  // }

  onFundChangeWorking(ev: any) {
    if (
      this.businessSizeAnnex.rate === 0 &&
      this.businessTypeAnnex.rate === 0
    ) {
      let code = 0;
      if (this.hasBusinessSize) {
        code = + this.formArray.get([1]).get('businessSizeId').value;
      } else {
        code = + this.formArray.get([1]).get('businessTypeId').value;
        // code = +this.formGroup.controls.businessTypeId.value;
      }
      const current = +this.formArray.get([1]).get('currentCapital').value;
      const fund = +ev;
      this.brsService.getAnnexRate(code, fund + current).subscribe(x => {
        this.formArray.get([1]).get('rate').setValue(x);
      });
    }
  }

  // citizenshipNoChanged(ev: any) {
  //   const districtId = +this.formArray.get([0]).get('citizenShipDistrictId').value;
  //   const citizenshipNo = ev;
  //   if (districtId > 0 && citizenshipNo) {
  //     this.getMember(citizenshipNo, districtId);
  //   }
  // }
  citizenDistrictChanged(ev: any) {
    const districtId = +ev.value;
    const citizenshipNo = this.formArray.get([0]).get('citizenShipNo').value;
    if (districtId > 0 && citizenshipNo) {
      this.getMember(citizenshipNo, districtId);
    } else {
      this.clearMemberValue();
    }
  }

  getMember(citizenshipNo: string, districtId: number) {
    this.globalService.setLoading(true);
    this.brsService.getMember(citizenshipNo, districtId).subscribe(x => {
      if (x) {
        this.setMemberValue(x);
      } else {
        this.clearMemberValue();
      }
      this.globalService.setLoading(false);
    });
  }
  setMemberValue(x: any) {
    this.memberId = x.id;
    this.formArray.get([0]).get('citizenShipNo').setValue(x.citizenShipNo);
    this.formArray.get([0]).get('citizenShipDistrictId').setValue(x.citizenShipDistrictId);

    this.formArray.get([0]).get('nameInNepali').setValue(x.nameInNepali);
    this.formArray.get([0]).get('nameInEnglish').setValue(x.nameInEnglish);
    this.formArray.get([0]).get('panNo').setValue(x.panNo);

    const date = new Date(x.citizenShipIssueDate);
    this.formArray.get([0]).get('citizenShipIssueDate').setValue(date);

    this.formArray.get([0]).get('mobileNo').setValue(x.mobileNo);
    this.formArray.get([0]).get('phoneNo').setValue(x.phoneNo);
    this.formArray.get([0]).get('email').setValue(x.email);

    this.formArray.get([0]).get('mothersName').setValue(x.mothersName);
    this.formArray.get([0]).get('fathersName').setValue(x.fathersName);
    this.formArray.get([0]).get('grandFathersName').setValue(x.grandFathersName);

    this.perAddId = +x.memberAddresses[0].id;
    this.temAddId = +x.memberAddresses[1].id;

    const pStateId = +x.memberAddresses[0].municipality.district.stateId;
    const tStateId = +x.memberAddresses[1].municipality.district.stateId;

    this.formArray.get([0]).get('permanentAddress').get('stateId').setValue(pStateId.toString());
    this.formArray.get([0]).get('temporaryAddress').get('stateId').setValue(tStateId.toString());
    this.brsService.getDistrictByStateId(pStateId).subscribe(pd => {
      this.districtListP = pd;
      if (pStateId === tStateId) {
        this.districtListT = pd;
      } else {
        this.brsService.getDistrictByStateId(tStateId).subscribe(td => {
          this.districtListT = td;
        });
      }
    });

    const pDistrictId = +x.memberAddresses[0].municipality.district.id;
    const tDistrictId = +x.memberAddresses[1].municipality.district.id;

    this.formArray.get([0]).get('permanentAddress').get('districtId').setValue(pDistrictId.toString());
    this.formArray.get([0]).get('temporaryAddress').get('districtId').setValue(tDistrictId.toString());
    this.brsService.getCityByDistrictId(pDistrictId).subscribe(pc => {
      this.cityListP = pc;
      if (pDistrictId === tDistrictId) {
        this.cityListT = pc;
      } else {
        this.brsService.getCityByDistrictId(tDistrictId).subscribe(tc => {
          this.cityListT = tc;
        });
      }
    });

    const pCityId = +x.memberAddresses[0].municipality.id;
    const tCityId = +x.memberAddresses[1].municipality.id;
    this.formArray.get([0]).get('permanentAddress').get('cityId').setValue(pCityId.toString());
    this.formArray.get([0]).get('temporaryAddress').get('cityId').setValue(tCityId.toString());

    this.formArray.get([0]).get('permanentAddress').get('wardNo').setValue(x.memberAddresses[0].wardNo);
    this.formArray.get([0]).get('temporaryAddress').get('wardNo').setValue(x.memberAddresses[1].wardNo);

    this.formArray.get([0]).get('permanentAddress').get('tole').setValue(x.memberAddresses[0].tole);
    this.formArray.get([0]).get('temporaryAddress').get('tole').setValue(x.memberAddresses[1].tole);

    this.formArray.get([0]).get('permanentAddress').get('houseNo').setValue(x.memberAddresses[0].houseNo);
    this.formArray.get([0]).get('temporaryAddress').get('houseNo').setValue(x.memberAddresses[1].houseNo);
    this.imgUrl = this.iconPath + x.photoURL;
  }

  clearMemberValue() {
    this.memberId = null;

    this.formArray.get([0]).get('nameInNepali').setValue('');
    this.formArray.get([0]).get('nameInEnglish').setValue('');
    this.formArray.get([0]).get('panNo').setValue('');

    // const date = new Date(x.citizenShipIssueDate);
    this.formArray.get([0]).get('citizenShipIssueDate').setValue(null);

    this.formArray.get([0]).get('mobileNo').setValue(null);
    this.formArray.get([0]).get('phoneNo').setValue(null);
    this.formArray.get([0]).get('email').setValue(null);

    this.formArray.get([0]).get('mothersName').setValue(null);
    this.formArray.get([0]).get('fathersName').setValue(null);
    this.formArray.get([0]).get('grandFathersName').setValue(null);

    this.perAddId = null;
    this.temAddId = null;

    // this.formArray.get([0]).get('permanentAddress').get('stateId').setValue(null);
    // this.formArray.get([0]).get('temporaryAddress').get('stateId').setValue(null);


    // this.formArray.get([0]).get('permanentAddress').get('districtId').setValue(null);
    // this.formArray.get([0]).get('temporaryAddress').get('districtId').setValue(null);

    // this.formArray.get([0]).get('permanentAddress').get('cityId').setValue(null);
    // this.formArray.get([0]).get('temporaryAddress').get('cityId').setValue(null);

    // this.formArray.get([0]).get('permanentAddress').get('wardNo').setValue(null);
    // this.formArray.get([0]).get('temporaryAddress').get('wardNo').setValue(null);

    // this.formArray.get([0]).get('permanentAddress').get('tole').setValue(null);
    // this.formArray.get([0]).get('temporaryAddress').get('tole').setValue(null);

    // this.formArray.get([0]).get('permanentAddress').get('houseNo').setValue(null);
    // this.formArray.get([0]).get('temporaryAddress').get('houseNo').setValue(null);
    this.loadDefaultAddress();
    this.imgUrl = this.iconPath + 'default.jpg';
  }
  onFundChangeCurrent(ev: any) {
    if (
      this.businessSizeAnnex.rate === 0 &&
      this.businessTypeAnnex.rate === 0
    ) {
      let code = 0;
      if (this.hasBusinessSize) {
        code = + this.formArray.get([1]).get('businessSizeId').value;
      } else {
        code = + this.formArray.get([1]).get('businessTypeId').value;
      }
      const working = +this.formArray.get([1]).get('workingCapital').value;
      const fund = +ev;
      this.brsService.getAnnexRate(code, fund + working).subscribe(x => {
        this.formArray.get([1]).get('rate').setValue(x);
      });
    }
  }
  wardChanged(ev: any, flag: number) {
    if (!this.redgId) {
      if (flag === 1) {
        this.formArray.get([0]).get('temporaryAddress').get('wardNo').setValue(ev);
        this.formArray.get([1]).get('houseOwner').get('wardNo').setValue(ev);
      } else if (flag === 2) {
        this.formArray.get([1]).get('houseOwner').get('wardNo').setValue(ev);
      }
    }
  }
  toleChanged(ev: any, flag: number) {
    if (!this.redgId) {
      if (flag === 1) {
        this.formArray.get([0]).get('temporaryAddress').get('tole').setValue(ev);
        this.formArray.get([1]).get('houseOwner').get('tole').setValue(ev);
      } else if (flag === 2) {
        this.formArray.get([1]).get('houseOwner').get('tole').setValue(ev);
      }
    }
  }
  houseNoChanged(ev: any, flag: number) {
    if (!this.redgId) {
      if (flag === 1) {
        this.formArray.get([0]).get('temporaryAddress').get('houseNo').setValue(ev);
        this.formArray.get([1]).get('houseOwner').get('houseNo').setValue(ev);
      } else if (flag === 2) {
        this.formArray.get([1]).get('houseOwner').get('houseNo').setValue(ev);
      }
    }
  }
  cityChanged(ev: any, flag: any) {
    const cityId = +ev.value;
    if (!this.redgId) {
      if (flag === 1) {
        this.formArray.get([0]).get('temporaryAddress').get('cityId').setValue(cityId.toString());
        this.formArray.get([1]).get('houseOwner').get('cityId').setValue(cityId.toString());
      } else if (flag === 2) {
        this.formArray.get([1]).get('houseOwner').get('cityId').setValue(cityId.toString());
      }
    }
  }
  districtChanged(ev: any, flag: any) {
    this.globalService.setLoading(true);
    const districtId = +ev.value;
    this.brsService.getCityByDistrictId(districtId).subscribe(x => {
      if (flag === 1) {
        this.cityListP = x;
        this.formArray.get([0]).get('permanentAddress').get('cityId').setValue(null);
        if (!this.redgId) {
          this.formArray.get([0]).get('temporaryAddress').get('districtId').setValue(districtId.toString());
          this.formArray.get([0]).get('temporaryAddress').get('cityId').setValue(null);
          this.cityListT = x;

          this.formArray.get([1]).get('houseOwner').get('districtId').setValue(districtId.toString());
          this.formArray.get([1]).get('houseOwner').get('cityId').setValue(null);
          this.cityListH = x;
        }
      } else if (flag === 2) {
        this.cityListT = x;
        this.formArray.get([0]).get('temporaryAddress').get('cityId').setValue(null);
        if (!this.redgId) {
          this.formArray.get([1]).get('houseOwner').get('districtId').setValue(districtId.toString());
          this.formArray.get([1]).get('houseOwner').get('cityId').setValue(null);
          this.cityListH = x;
        }

      } else if (flag === 3) {
        this.cityListH = x;
        this.formArray.get([1]).get('houseOwner').get('cityId').setValue(null);
      }
      this.globalService.setLoading(false);
    });
  }

  stateChanged(ev: any, flag: any) {
    this.globalService.setLoading(true);
    const stateId = +ev.value;
    this.brsService.getDistrictByStateId(stateId).subscribe(x => {
      if (flag === 1) {
        this.districtListP = x;
        this.cityListP = [];
        this.formArray.get([0]).get('permanentAddress').get('districtId').setValue(null);
        this.formArray.get([0]).get('permanentAddress').get('cityId').setValue(null);
        if (!this.redgId) {
          this.formArray.get([0]).get('temporaryAddress').get('stateId').setValue(stateId.toString());
          this.formArray.get([0]).get('temporaryAddress').get('districtId').setValue(null);
          this.formArray.get([0]).get('temporaryAddress').get('cityId').setValue(null);
          this.districtListT = x;
          this.cityListT = [];

          this.formArray.get([1]).get('houseOwner').get('stateId').setValue(stateId.toString());
          this.formArray.get([1]).get('houseOwner').get('districtId').setValue(null);
          this.formArray.get([1]).get('houseOwner').get('cityId').setValue(null);
          this.districtListH = x;
          this.cityListH = [];
        }

      } else if (flag === 2) {
        this.districtListT = x;
        this.cityListT = [];
        this.formArray.get([0]).get('temporaryAddress').get('districtId').setValue(null);
        this.formArray.get([0]).get('temporaryAddress').get('cityId').setValue(null);
        if (!this.redgId) {
          this.formArray.get([1]).get('houseOwner').get('stateId').setValue(stateId.toString());
          this.formArray.get([1]).get('houseOwner').get('districtId').setValue(null);
          this.formArray.get([1]).get('houseOwner').get('cityId').setValue(null);
          this.districtListH = x;
          this.cityListH = [];
        }
      } else if (flag === 3) {
        this.districtListH = x;
        this.cityListH = [];
        this.formArray.get([1]).get('houseOwner').get('districtId').setValue(null);
        this.formArray.get([1]).get('houseOwner').get('cityId').setValue(null);
      }
      this.globalService.setLoading(false);
    });
  }

  onFileSelected(event: any) {
    this.globalService.setLoading(true);
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      // tslint:disable-next-line:no-shadowed-variable
      reader.onload = (event: any) => {
        this.imgUrl = event.target.result;
        this.globalService.setLoading(false);
      };
      this.selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.selectedFile = null;
      this.imgUrl = null;
    }
  }

  // goToMap(stepper: MatStepper) {
  //   this.map.invalidateSize();
  //   this.map.flyTo(new L.LatLng(this.lat, this.lng), 17);
  //   stepper.next();
  // }

  // goBackMap(stepper: MatStepper) {
  //   stepper.previous();
  // }

  resetEntryForm(form: any) {

  }

  onSubmit({ value, valid }: { value: any; valid: boolean }) {
    if (!this.formArray.get([0]).valid ||
      !this.formArray.get([1]).valid) {
      this.globalService.showErrorMessage('आवस्यक डाटा पुगेको छैन ।');
      return;
    }

    if (this.isOld || this.formType === 'verify') {
      if (!this.formArray.get([2]).valid) {
        this.globalService.showErrorMessage('1आवस्यक डाटा पुगेको छैन ।');
        return;
      }
    }
    if (this.formType === 'verify') {

      const verify = value.formArray[2];
      const verifyInput: BusinessVerifyInput = {
        id: +this.redgId,
        fiscalYear: verify.fiscalYear,
        redgNo: +verify.redgNo,
        issuedPersonName: verify.issuedPersonName,
        verificationDate: verify.verifiedDate,
        lastRenewDate: verify.verifiedDate,
        expireOn: this.expireOn,
        month: this.calendar.GetBSMonth(this.calendar.GetDateBS(verify.verifiedDate, DateFormat.yyyyMMdd), DateFormat.yyyyMMdd),
        applicationFee: +verify.applicationFee,
        registrationFee: +verify.registrationFee,
        penaltyFee: +verify.penaltyFee,
        businessTax: +verify.businessTax,
        totalAmount: +verify.totalAmount
      };


      this.brsService.verifyBusiness(verifyInput).subscribe(
        x => {
          this.globalService.showSuccessMessage(
            'ब्यवसाय सफलतापूर्वक भेरिफाइ भयाे ।'
          );
          const data = { flag: 'saveAndclose' };
          this.buttonClicked.emit(data);
        },
        error => {
          this.globalService.showErrorMessage(error.message);
        }
      );

    } else {

      if (+value.formArray[1].workingCapital + +value.formArray.currentCapital <= 0) {
        this.globalService.showErrorMessage('चालु पूजी वा स्थिर पूजी चाहिन्छ।');
        return;
      }
      this.globalService.setLoading(true);
      let entryType = 1;
      if (this.formType === 'edit') {
        entryType = 2;
      } else if (this.formType === 'renew') {
        entryType = 3;
      }

      const memberValue = value.formArray[0];

      const permAddInput: MemberAddressInput = {
        id: +this.perAddId,
        municipalityId: +memberValue.permanentAddress.cityId,
        addressType: 1,
        houseNo: memberValue.permanentAddress.houseNo,
        tole: memberValue.permanentAddress.tole,
        wardNo: +memberValue.permanentAddress.wardNo
      };

      const tempAddInput: MemberAddressInput = {
        id: +this.temAddId,
        municipalityId: +memberValue.temporaryAddress.cityId,
        addressType: 1,
        houseNo: memberValue.temporaryAddress.houseNo,
        tole: memberValue.temporaryAddress.tole,
        wardNo: +memberValue.temporaryAddress.wardNo
      };

      const memberInput: MemberInput = {
        id: +this.memberId,
        nameInNepali: memberValue.nameInNepali,
        nameInEnglish: memberValue.nameInEnglish,
        citizenShipNo: memberValue.citizenShipNo,
        citizenShipDistrictId: memberValue.citizenShipDistrictId,
        citizenShipIssueDate: new Date(memberValue.citizenShipIssueDate),
        panNo: memberValue.panNo ? memberValue.panNo.toString() : null,
        phoneNo: memberValue.phoneNo,
        mobileNo: memberValue.mobileNo.toString(),
        email: memberValue.email,
        faxNo: memberValue.faxNo,
        fathersName: memberValue.fathersName,
        mothersName: memberValue.mothersName,
        grandFathersName: memberValue.grandFathersName,
        permanentAddress: permAddInput,
        temporaryAddress: tempAddInput
      };

      const businessValue = value.formArray[1];

      const houseOwnerInput: HouseOwnerInput = {
        id: entryType === 3 ? undefined : +this.houseAddId,
        name: businessValue.houseOwner.houseOwnerName,
        monthlyRent: +businessValue.houseOwner.monthlyRent,
        rentFrequency: businessValue.houseOwner.rentFrequency,
        houseNo: businessValue.houseOwner.houseNo,
        tole: businessValue.houseOwner.tole,
        street: businessValue.houseOwner.street,
        wardNo: +businessValue.houseOwner.wardNo,
        municipalityId: +businessValue.houseOwner.cityId,
      };

      let otherRedgInput: OtherRedgInput = {
        id: entryType === 3 ? undefined : +this.otherRedgId,
        otherRedgNo: businessValue.otherRegistration.otherRedgNo,
        otherRedgOffice: businessValue.otherRegistration.otherRedgOffice,
        redgDate: businessValue.otherRegistration.redgDate,
      };
      if (!otherRedgInput.otherRedgNo && !otherRedgInput.otherRedgOffice) {
        otherRedgInput = undefined;
      }
      let businessVerifyInput: BusinessVerifyInput;
      const newLatLng = this.marker.getLatLng();
      const mapInput: MapInput = {
        id: +this.mapId,
        lat: newLatLng.lat,
        lng: newLatLng.lng
      };

      if (this.isOld) {
        const verify = value.formArray[2];
        businessVerifyInput = {
          id: -1,
          fiscalYear: verify.fiscalYear,
          redgNo: verify.redgNo,
          issuedPersonName: verify.issuedPersonName,
          verificationDate: verify.verifiedDate,
          lastRenewDate: verify.lastRenewDate,
          expireOn: this.expireOn,
          month: 1,
          applicationFee: 0,
          registrationFee: 0,
          penaltyFee: 0,
          businessTax: 0,
          totalAmount: 0
        };
      }

      const businessInput: BrsInput = {
        id: +this.redgId,
        entryType: entryType,
        businessClassId: +businessValue.businessClassId,
        businessTypeId: +businessValue.businessTypeId,
        businessSizeId: +businessValue.businessSizeId === 0 ? undefined : +businessValue.businessSizeId,
        businessName: businessValue.businessName,
        businessNameEnglish: businessValue.businessNameEnglish,
        panNo: businessValue.panNo ? businessValue.panNo.toString() : null,
        redgDate: new Date(businessValue.redgDate),
        workingCapital: +businessValue.workingCapital,
        currentCapital: +businessValue.currentCapital,
        rate: +businessValue.rate,
        turnOver: +businessValue.turnOver,
        employmentDirect: +businessValue.employmentDirect,
        employmentIndirect: +businessValue.employmentIndirect,
        remarks: businessValue.remarks,
        member: memberInput,
        houseOwner: houseOwnerInput,
        otherRedg: otherRedgInput,
        verifyBusiness: businessVerifyInput,
        map: mapInput
      };

      const img: Upload = this.selectedFile;


      this.brsService.registerBusiness(businessInput, img).subscribe(
        x => {
          if (x) {
            if (this.redgId === 0) {
              this.globalService.showSuccessMessage('डाटा सफलतापुर्वक सेभ भयो ।');
            } else {
              this.globalService.showSuccessMessage(
                'डाटा सफलतापुर्वक इडिट भयो ।'
              );
            }
            const data = { flag: 'saveAndclose' };
            this.buttonClicked.emit(data);
          }
        },
        error => {
          this.globalService.showErrorMessage(error.message);
        }
      );
    }
  }


  loadInitialBillNo() {
    const date = new Date();
    const dateBS = this.calendar.GetDateBS(
      date,
      this.dpOptionVerifiedDate.dateFormatBS
    );
    const result = {
      selectedDate: {
        date: date,
        dateBS: dateBS
      }
    };
    this.verifiedDateChanged(result);
  }

  loadForm(data: any) {
    this.globalService.setLoading(true);
    this.formType = data.flag;
    this.redgId = +data.id;
    if (data.flag === 'details') {
      this.pageTitle = 'ब्यवसायकाे बिवरण';
    } else if (data.flag === 'edit') {
      this.pageTitle = 'ब्यवसायकाे बिवरण (सच्याउन)';
    } else if (data.flag === 'add') {
      this.pageTitle = 'ब्यवसाय दर्ता';
    } else if (data.flag === 'renew') {
      this.pageTitle = 'ब्यवसाय नबिकरण';
    } else if (data.flag === 'verify') {
      this.pageTitle = 'ब्यवसाय दर्ता भेरिफाइ';

    } else if (data.flag === 'print') {
      this.pageTitle = 'ब्यवसाय प्रमाणपत्र';
    } else if (data.flag === 'delete') {
      this.pageTitle = 'ब्यवसाय प्रमाणपत्र हटाउन';
    }
    this.globalService.setPageTitle(this.pageTitle);


    if (this.formType === 'verify') {
      this.formArray.get([2]).get('lastRenewDate').clearValidators();
    } else {
      this.formArray.get([2]).get('lastRenewDate').setValidators([Validators.required]);
    }
    this.formArray.get([2]).get('lastRenewDate').updateValueAndValidity();

    if (this.redgId) {
      // this.brsService.getBusiness(+data.id).subscribe(x => {
      const x = data.x;
      const y = data.y;
      const business = x.business;
      this.redgId = +business.id;
      this.oldRedgNo = business.redgNo;
      if (x.business.otherRegistrations.length > 0) {
        this.otherRedgId = +x.business.otherRegistrations[0].id;
      } else {
        this.otherRedgId = undefined;
      }
      this.setMemberValue(business.member);

      this.businessTypeAnnex = y.businessType;
      this.businessSizeAnnex = y.businessSize;
      this.hasBusinessSize = y.businessSize.hasChild;
      this.businessSizeRequired(y.businessSize.hasChild);
      this.districtListH = y.hdistricts;
      this.cityListH = y.hcities;
      //     }
      //   },
      //   error => {
      //     this.globalService.showErrorMessage(error.message);
      //   }
      // );
      this.formArray.get([1]).get('businessClassId').setValue(
        business.businessClassId.toString()
      );
      this.formArray.get([1]).get('businessTypeId').setValue(
        business.businessTypeId.toString()
      );
      if (business.businessSizeId) {
        this.formArray.get([1]).get('businessSizeId').setValue(
          business.businessSizeId.toString()
        );
      }
      this.formArray.get([1]).get('businessName').setValue(
        business.businessName
      );
      this.formArray.get([1]).get('businessNameEnglish').setValue(
        business.businessNameEnglish
      );
      this.formArray.get([1]).get('panNo').setValue(business.panNo);

      const date = new Date(business.redgDate);
      this.formArray.get([1]).get('redgDate').setValue(date);
      this.formArray.get([1]).get('workingCapital').setValue(
        business.workingCapital
      );
      this.formArray.get([1]).get('currentCapital').setValue(
        business.currentCapital
      );
      this.formArray.get([1]).get('rate').setValue(business.rate);
      this.formArray.get([1]).get('turnOver').setValue(business.turnOver);

      this.formArray.get([1]).get('employmentDirect').setValue(business.employmentDirect);
      this.formArray.get([1]).get('employmentIndirect').setValue(business.employmentIndirect);
      this.formArray.get([1]).get('remarks').setValue(business.remarks);

      const houseOwner = business.houseOwners[0];
      this.houseAddId = houseOwner.id;

      this.formArray.get([1]).get('houseOwner').get('houseOwnerName').setValue(houseOwner.name);
      this.formArray.get([1]).get('houseOwner').get('monthlyRent').setValue(houseOwner.monthlyRent);
      this.formArray.get([1]).get('houseOwner').get('rentFrequency').setValue(houseOwner.rentFrequency);

      this.formArray.get([1]).get('houseOwner').get('stateId').setValue(houseOwner.municipality.district.stateId.toString());
      this.formArray.get([1]).get('houseOwner').get('districtId').setValue(houseOwner.municipality.district.id.toString());
      this.formArray.get([1]).get('houseOwner').get('cityId').setValue(houseOwner.municipality.id.toString());
      this.formArray.get([1]).get('houseOwner').get('tole').setValue(houseOwner.tole);
      this.formArray.get([1]).get('houseOwner').get('street').setValue(houseOwner.street);
      this.formArray.get([1]).get('houseOwner').get('wardNo').setValue(houseOwner.wardNo);
      this.formArray.get([1]).get('houseOwner').get('houseNo').setValue(houseOwner.houseNo);

      if (this.otherRedgId) {
        const otherRedg = business.otherRegistrations[0];
        this.formArray.get([1]).get('otherRegistration').get('otherRedgOffice').setValue(otherRedg.otherRedgOffice);
        this.formArray.get([1]).get('otherRegistration').get('otherRedgNo').setValue(otherRedg.otherRedgNo);
        if (otherRedg.redgDate) {
          this.formArray.get([1]).get('otherRegistration').get('redgDate').setValue(new Date(otherRedg.redgDate));
        }
      }

      if (business.maps) {
        if (business.maps.length > 0) {
          this.mapId = +business.maps[0].id;
          // this.lat = business.maps[0].lat;
          // this.lng = business.maps[0].lng;
          const newLatLng = new L.LatLng(business.maps[0].lat, business.maps[0].lng);
          this.marker.setLatLng(newLatLng);
          this.map.panTo(newLatLng);
        } else {

        }
      }

      if (data.flag === 'details') {
        this.formArray.get([2]).get('fiscalYear').setValue(business.fYear);
        this.formArray.get([2]).get('redgNo').setValue(business.redgNo);
        this.formArray.get([2]).get('issuedPersonName').setValue(business.issuedPersonName);
        this.formArray.get([2]).get('applicationFee').setValue(business.applicationFee);
        this.formArray.get([2]).get('registrationFee').setValue(business.registrationFee);
        this.formArray.get([2]).get('penaltyFee').setValue(business.penaltyFee);
        this.formArray.get([2]).get('businessTax').setValue(business.rate);
        this.formArray.get([2]).get('totalAmount').setValue(business.totalAmount);
        this.formArray.get([2]).get('verifiedDate').setValue(new Date(business.verificationDate));
        this.formArray.get([2]).get('lastRenewDate').setValue(new Date(business.lastRenewDate));
      } else if (data.flag === 'verify') {
        let totalAmount = 0;
        this.formArray.get([2]).get('fiscalYear').setValue(business.fYear);
        this.loadInitialBillNo();

        this.formArray.get([2]).get('redgNo').setValue(business.redgNo);
        this.formArray.get([2]).get('issuedPersonName').setValue(business.issuedPersonName);
        this.formArray.get([2]).get('verifiedDate').setValue(new Date());
        if (this.paramValue.AllowApplicationFee) {
          this.formArray.get([2]).get('applicationFee').setValue(this.paramValue.ApplicationFeeValue);
          totalAmount = this.paramValue.ApplicationFeeValue;
        } else {
          this.formArray.get([2]).get('applicationFee').setValue(0);
        }
        if (this.paramValue.AllowRegistrationFee) {
          this.formArray.get([2]).get('registrationFee').setValue(this.paramValue.RegistrationFeeValue);
          totalAmount = totalAmount + this.paramValue.RegistrationFeeValue;
        } else {
          this.formArray.get([2]).get('registrationFee').setValue(0);
        }
        this.formArray.get([2]).get('penaltyFee').setValue(business.penaltyFee);
        this.formArray.get([2]).get('businessTax').setValue(business.rate);
        totalAmount = totalAmount + business.rate;
        this.formArray.get([2]).get('totalAmount').setValue(totalAmount);
      }
       this.globalService.setLoading(false);
    } else {

      this.clearForm();
      setTimeout(() => {
        this.loadDefaultAddress();
      }, 500);
    }
  }


  loadDefaultAddress() {
    this.brsService.getDistrictByStateId(this.paramValue.DefaultState).subscribe(pd => {
      this.districtListP = pd;
      this.districtListT = pd;
      this.formArray.get([0]).get('permanentAddress').get('stateId').setValue(this.paramValue.DefaultState.toString());
      this.formArray.get([0]).get('temporaryAddress').get('stateId').setValue(this.paramValue.DefaultState.toString());
      this.formArray.get([1]).get('houseOwner').get('stateId').setValue(this.paramValue.DefaultState.toString());



    });

    this.brsService.getCityByDistrictId(this.paramValue.DefaultDistrict).subscribe(pd => {
      this.cityListP = pd;
      this.cityListT = pd;

      this.formArray.get([0]).get('permanentAddress').get('districtId').setValue(this.paramValue.DefaultDistrict.toString());
      this.formArray.get([0]).get('temporaryAddress').get('districtId').setValue(this.paramValue.DefaultDistrict.toString());
      this.formArray.get([1]).get('houseOwner').get('districtId').setValue(this.paramValue.DefaultDistrict.toString());

      this.formArray.get([0]).get('permanentAddress').get('cityId').setValue(this.paramValue.DefaultCity.toString());
      this.formArray.get([0]).get('temporaryAddress').get('cityId').setValue(this.paramValue.DefaultCity.toString());
      this.formArray.get([1]).get('houseOwner').get('cityId').setValue(this.paramValue.DefaultCity.toString());


    });

    if (+this.paramValue.WardNo !== 0) {
      this.formArray.get([0]).get('permanentAddress').get('wardNo').setValue(this.paramValue.WardNo.toString());
      this.formArray.get([0]).get('temporaryAddress').get('wardNo').setValue(this.paramValue.WardNo.toString());
      this.formArray.get([1]).get('houseOwner').get('wardNo').setValue(this.paramValue.WardNo.toString());
    }


    this.formArray.get([0]).get('permanentAddress').get('tole').setValue('');
    this.formArray.get([0]).get('permanentAddress').get('houseNo').setValue('');
    this.formArray.get([0]).get('temporaryAddress').get('tole').setValue('');
    this.formArray.get([0]).get('temporaryAddress').get('houseNo').setValue('');
    this.formArray.get([1]).get('houseOwner').get('tole').setValue('');
    this.formArray.get([1]).get('houseOwner').get('houseNo').setValue('');

  }
  clearForm() {
    this.formGroup.reset();
    this.isOld = false;
    this.redgId = undefined;
    this.memberId = undefined;
    this.oldRedgNo = undefined;
    this.perAddId = undefined;
    this.temAddId = undefined;
    this.houseAddId = undefined;
    this.otherRedgId = undefined;
    this.expireOn = null;
    this.imgUrl = this.iconPath + 'default.jpg';
    this.selectedFile = null;

    this.setDateValue();

    this.businessTypeAnnex.rateList = [];
    this.businessSizeAnnex.rateList = [];

    this.districtListP = this.defaultDistrictList;
    this.cityListP = this.defaultCityList;
    this.districtListT = this.defaultDistrictList;
    this.cityListT = this.defaultCityList;
    this.districtListH = this.defaultDistrictList;
    this.cityListH = this.defaultCityList;

    this.formArray.get([0]).get('permanentAddress').setValue({
      stateId: this.defaultStateId ? this.defaultStateId.toString() : this.paramValue.DefaultState.toString(),
      districtId: this.defaultDistrictId ? this.defaultDistrictId.toString() : this.paramValue.DefaultDistrict.toString(),
      cityId: this.defaultCityId ? this.defaultCityId.toString() : this.paramValue.DefaultCity.toString(),
      houseNo: '',
      wardNo: '',
      tole: ''
    });

    this.formArray.get([0]).get('temporaryAddress').setValue({
      stateId: this.defaultStateId ? this.defaultStateId.toString() : this.paramValue.DefaultState.toString(),
      districtId: this.defaultDistrictId ? this.defaultDistrictId.toString() : this.paramValue.DefaultDistrict.toString(),
      cityId: this.defaultCityId ? this.defaultCityId.toString() : this.paramValue.DefaultCity.toString(),
      houseNo: '',
      wardNo: '',
      tole: ''
    });

    this.formArray.get([1]).get('houseOwner').setValue({
      houseOwnerName: '',
      monthlyRent: '',
      rentFrequency: '',
      stateId: this.defaultStateId ? this.defaultStateId.toString() : this.paramValue.DefaultState.toString(),
      districtId: this.defaultDistrictId ? this.defaultDistrictId.toString() : this.paramValue.DefaultDistrict.toString(),
      cityId: this.defaultCityId ? this.defaultCityId.toString() : this.paramValue.DefaultCity.toString(),
      houseNo: '',
      wardNo: '',
      street: '',
      tole: ''
    });

    this.stepper.reset();

  }

  closeButtonClick(form: any, stepper: any) {
    //   this.resetEntryForm(form, stepper);
    const data = { flag: 'close' };
    this.buttonClicked.emit(data);

    // setTimeout(() => {
    //   this.clearForm();
    // }, 200);
  }

  verifiedDateChanged($event: any) {
    if ($event.selectedDate.date) {
      this.globalService.setLoading(true);
      const fiscalYear = this.calendar.getFiscalYear($event.selectedDate.date);
      this.formArray.get([2]).get('fiscalYear').setValue(fiscalYear);
      this.expireOn = this.brsService.getExpiredDate(
        $event.selectedDate.dateBS,
        this.dpOptionVerifiedDate.dateFormatBS
      );
      if (this.redgId) {
        this.brsService
          .getCertificateNoAndPenalty(
            +this.redgId,
            fiscalYear,
            $event.selectedDate.date
          )
          .subscribe(
            x => {
              if (this.oldRedgNo !== null) {
                this.formArray.get([2]).get('redgNo').setValue(this.oldRedgNo);
              } else {
                this.formArray.get([2]).get('redgNo').setValue(x.certificateNumber);
              }
              const rate = +this.formArray.get([1]).get('rate').value;
              this.formArray.get([2]).get('penaltyFee').setValue(x.penalty);
              this.formArray.get([2]).get('businessTax').setValue(rate * x.totalYear);
              const total = (rate * x.totalYear) + x.penalty +
                +this.formArray.get([2]).get('applicationFee').value +
                +this.formArray.get([2]).get('registrationFee').value;
                this.formArray.get([2]).get('totalAmount').setValue(total);

              // applicationFee: ['0', Validators.compose([Validators.required, Validators.min(0)])],
              //   registrationFee: ['0', Validators.compose([Validators.required, Validators.min(0)])],
              //     penaltyFee: ['0', Validators.compose([Validators.required, Validators.min(0)])],
              //       businessTax: ['0', Validators.compose([Validators.required, Validators.min(0)])],
              //         verifiedDate: [new Date(), Validators.required],
              //           totalAmount: ['0'],


                          this.globalService.setLoading(false);
            },
            error => {
              this.clearPenaltyAndNo();
              this.globalService.showErrorMessage(error.message);
            }
          );
      } else {
        this.globalService.setLoading(false);
      }
    } else {
      this.clearPenaltyAndNo();
    }
  }

  clearPenaltyAndNo() {
    this.formArray.get([2]).get('redgNo').setValue('');
    this.formArray.get([2]).get('penaltyFee').setValue(0);
    this.formArray.get([2]).get('fiscalYear').setValue('');
    this.expireOn = null;
  }


  // onVerify({ value, valid }: { value: any; valid: boolean }) {
  //   console.log(value, valid);
  //   if (!valid) {
  //     this.globalService.showErrorMessage('अावस्यक डाटा पगेकाे छैन।');
  //   }
  //   const verify = value.formArray[2];
  //   const business: BusinessVerifyInput = {
  //     id: verify.id,
  //     fiscalYear: verify.fiscalYear,
  //     redgNo: verify.redgNo,
  //     issuedPersonName: verify.issuedPersonName,
  //     verificationDate: verify.verifiedDate,
  //     lastRenewDate: verify.lastRenewDate,
  //     expireOn: this.expireOn,
  //     month: this.calendar.GetBSMonth(this.calendar.GetDateBS(verifiedOn, DateFormat.yyyyMMdd), DateFormat.yyyyMMdd),
  //     applicationFee: 0,
  //     registrationFee: 0,
  //     penaltyFee: 0,
  //     businessTax: 0,
  //     totalAmount: 0
  //   };

  // }

  newOrOld() {
    this.isOld = this.formArray.get([1]).get('isOld').value;
    this.dpOptionLastRenew.required = this.isOld;
  }

  deleteBusiness() {
    this.brsService.deleteBusiness(+this.redgId).subscribe(
      x => {
        this.globalService.showSuccessMessage('डाटा सफलतापूर्वक डिलिट भयाे।');
        const data = { flag: 'saveAndclose' };
        this.buttonClicked.emit(data);
      },
      error => {
        this.globalService.showErrorMessage(error.message);
      }
    );
  }
}
