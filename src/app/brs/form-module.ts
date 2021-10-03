import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';

export class FormModel {
  public RateForm() {
    return new FormBuilder().group({
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(500)
        ])
      ],
      isGroup: [''],
      parentName: [''],
      capital: [''],
      rate: ['']
    });
  }

  public AddressForm() {
    return new FormGroup({
      state: new FormControl('', Validators.required),
      district: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      wardNo: new FormControl('', Validators.required),
      houseNo: new FormControl('', Validators.required)
      // tole: new FormControl('', Validators.required),
    });
  }

  public VerifyForm() {
    return new FormBuilder().group({
      fiscalYear: ['', Validators.required],
      redgNo: ['', Validators.required],
      issuedPersonName: ['', Validators.required],
      applicationFee: [
        0,
        Validators.compose([Validators.required, Validators.min(0)])
      ],
      registrationFee: [
        0,
        Validators.compose([Validators.required, Validators.min(0)])
      ],
      penaltyFee: [
        0,
        Validators.compose([Validators.required, Validators.min(0)])
      ],
      businessTax: [
        0,
        Validators.compose([Validators.required, Validators.min(0)])
      ],
      boardFee: [
        0,
        Validators.compose([Validators.required, Validators.min(0)])
      ],
      verifiedDate: [new Date(), Validators.required],
      totalAmount: ['']
    });
  }

  public BusinessForm() {
    return new FormBuilder().group({
      businessClassId: ['', Validators.required],
      businessTypeId: ['', Validators.required],
      businessSizeId: [''],
      businessName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1000)
        ])
      ],
       redgDate: [''],
      // redgDate: ['', DateRangeValidator(true, new Date('2020-05-14'), new Date('2014-05-14'))],
      workingCapital: [
        0,
        Validators.compose([Validators.required, Validators.min(0)])
      ],
      currentCapital: [
        0,
        Validators.compose([Validators.required, Validators.min(0)])
      ],
      rate: ['', Validators.compose([Validators.required, Validators.min(0)])],
      // rate: [{ value: '', disabled: true }, Validators.compose([Validators.required, Validators.min(0)])],
      ownerName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(500)
        ])
      ],
      phoneNo: [''],
      mobileNo: ['', Validators.required],
      faxNo: [''],
      email: ['', Validators.compose([Validators.email])],
      fathersName: ['', Validators.required],
      mothersName: ['', Validators.required],
      grandFathersName: ['', Validators.required],
      citizenShipNo: ['', Validators.required],
      citizenShipDate: [''],
      citizenShipDistrictId: ['', Validators.required],
      houseOwnerName: ['', Validators.required],
      monthlyRent: ['', Validators.required],
      rentFrequency: [''],
      isWithBoard: [false],
      boardLength: [
        '',
        Validators.compose([Validators.required, Validators.min(0)])
      ],
      boardWidth: [
        '',
        Validators.compose([Validators.required, Validators.min(0)])
      ],
      boardArea: [
        '',
        Validators.compose([Validators.required, Validators.min(0)])
      ],
      boardText: ['', Validators.compose([Validators.maxLength(500)])],
      hasOtherBusiness: [false],
      otherBusinessType: [''],
      otherBusinessNo: [''],
      otherBusinessRedgDate: [''],
      hasVehicle: [false],
      vehicleRedgNo: [''],
      vehicleRedgDate: [''],
      hasOtherRedg: [false],
      otherRedgNo: [''],
      otherRedgOffice: ['', Validators.compose([Validators.maxLength(500)])],
      remarks: ['', Validators.compose([Validators.maxLength(500)])],
      permanentAddress: this.AddressForm(),
      temporaryAddress: this.AddressForm(),
      houseOwnerAddress: this.AddressForm(),
      verifyForm: this.VerifyForm()
    });
  }

  public ApeForm() {
    return new FormGroup({
      wardNo: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });
  }
}
