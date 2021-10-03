export type Maybe<T> = T | null;

export interface PaginationInput {
  pageNo: number;

  pageSize: number;

  filter?: Maybe<string[]>;

  sort?: Maybe<string[]>;
}

export interface CertificateNoInput {
  id: number;

  fyId: string;

  date: DateTime;
}

export interface ApeInput {
  id?: Maybe<number>;

  wardNo: number;

  title: string;

  description: string;
}

export interface BusinessVerifyInput {
  id: number;

  fiscalYear: string;

  redgNo: number;

  issuedPersonName: string;

  applicationFee: number;

  registrationFee: number;

  penaltyFee: number;

  businessTax: number;

  lastRenewDate: DateTime;

  verificationDate: DateTime;

  totalAmount: number;

  expireOn: DateTime;

  month: number;
}

export interface BrsInput {
  entryType: number;

  id?: Maybe<number>;

  businessClassId: number;

  businessTypeId: number;

  businessSizeId?: Maybe<number>;

  businessName: string;

  businessNameEnglish: string;

  redgDate: DateTime;

  panNo?: Maybe<string>;

  currentCapital: number;

  workingCapital: number;

  rate: number;

  turnOver?: Maybe<number>;

  employmentDirect?: Maybe<number>;

  employmentIndirect?: Maybe<number>;

  remarks?: Maybe<string>;

  member: MemberInput;

  houseOwner: HouseOwnerInput;

  board?: Maybe<BoardInput>;

  vehicle?: Maybe<VehicleInput>;

  map?: Maybe<MapInput>;

  otherBusiness?: Maybe<OtherBusinessInput>;

  otherRedg?: Maybe<OtherRedgInput>;

  verifyBusiness?: Maybe<BusinessVerifyInput>;
}

export interface MemberInput {
  id?: Maybe<number>;

  nameInNepali: string;

  nameInEnglish: string;

  citizenShipNo: string;

  citizenShipDistrictId: string;

  citizenShipIssueDate: DateTime;

  panNo?: Maybe<string>;

  phoneNo?: Maybe<string>;

  mobileNo?: Maybe<string>;

  faxNo?: Maybe<string>;

  email?: Maybe<string>;

  fathersName?: Maybe<string>;

  mothersName?: Maybe<string>;

  grandFathersName?: Maybe<string>;

  temporaryAddress: MemberAddressInput;

  permanentAddress: MemberAddressInput;
}

export interface MemberAddressInput {
  id?: Maybe<number>;

  addressType: number;

  municipalityId: number;

  wardNo: number;

  tole?: Maybe<string>;

  houseNo?: Maybe<string>;
}

export interface HouseOwnerInput {
  id?: Maybe<number>;

  name: string;

  municipalityId: number;

  wardNo: number;

  tole: string;

  street?: Maybe<string>;

  houseNo: string;

  monthlyRent: number;

  rentFrequency: string;
}

export interface BoardInput {
  id?: Maybe<number>;

  boardLength: number;

  boardWidth: number;

  boardArea: number;

  boardText?: Maybe<string>;

  boardRate?: Maybe<number>;

  boardFee?: Maybe<number>;
}

export interface VehicleInput {
  id?: Maybe<number>;

  vehicleRedgNo: string;

  vehicleRedgDate: DateTime;

  vehicleTax: number;
}

export interface MapInput {
  id?: Maybe<number>;

  lat: number;

  lng: number;
}

export interface OtherBusinessInput {
  id?: Maybe<number>;

  otherBusinessType: string;

  otherBusinessNo: string;

  otherBusinessRedgDate: DateTime;
}

export interface OtherRedgInput {
  id?: Maybe<number>;

  otherRedgOffice: string;

  otherRedgNo: string;

  redgDate: DateTime;
}

export interface LocationInput {
  id?: Maybe<number>;

  lat?: Maybe<number>;

  lng?: Maybe<number>;
}

export interface NoticeInput {
  id?: Maybe<number>;

  title: string;

  message: string;

  noticeTo: NoticeToInput[];
}

export interface NoticeToInput {
  id?: Maybe<number>;

  mobileNo: number;

  businessId: number;
}

export interface ParamInput {
  id?: Maybe<number>;

  name: string;

  parentId: number;

  isGroup: boolean;

  dataTypeId?: Maybe<number>;

  paramCode?: Maybe<string>;

  description?: Maybe<string>;

  script?: Maybe<string>;
}

export interface ParamValueInput {
  id: number;

  dataTypeId: number;

  defaultValue: string;
}

export interface RateInput {
  id?: Maybe<number>;

  caption: string;

  parentId: number;

  capital?: Maybe<number>;

  rate?: Maybe<number>;

  isGroup: boolean;
}

export interface UserAddInput {
  password: string;

  firstName: string;

  lastName: string;

  email: string;

  status: number;

  mobileNo?: Maybe<string>;

  roleId: number;

  wardId: number;
}

export interface UserEditInput {
  id: string;

  firstName: string;

  lastName: string;

  status: number;

  mobileNo?: Maybe<string>;

  roleId: number;

  wardId?: Maybe<number>;
}

export interface ChangePasswordInput {
  oldPassword: string;

  newPassword: string;
}

export interface ResetPasswordInput {
  id: string;

  newPassword: string;
}

export interface WardInput {
  id: string;

  address?: Maybe<string>;

  telNo?: Maybe<string>;

  lat?: Maybe<number>;

  lng?: Maybe<number>;

  isDefault: boolean;
}

export interface WardLocationInput {
  id: number[];

  lat: number[];

  lng: number[];
}

/** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
export type DateTime = any;

/** The `Upload` scalar type represents a file upload. */
export type Upload = any;
