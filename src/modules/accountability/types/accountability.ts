export interface AccountabilityRecord {
  id?: string;
  no: string;
  empId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  position: string;
  group: string;
  department: string;
  opCen: string;
  division: string;
  project: string;
  costCenter: string;
  projectLocation: string;
  employmentStatus: string;
  deviceType: string;
  deviceDescription: string;
  hostname: string;
  serialNumber: string;
  deviceCondition: string;
  deviceAssetNumber: string;
  monitorModel: string;
  monitorSerialNumber: string;
  monitorAssetNumber: string;
  tarf: string;
  softwareName: string;
  softwareLicense: string;
  phr: string;
  amld: string;
  it: string;
  cato: string;
  createdAt?: string;
  updatedAt?: string;
}

export const REQUIRED_FIELDS: Array<keyof AccountabilityRecord> = [
  "empId",
  "firstName",
  "lastName",
  "department",
  "hostname",
  "serialNumber",
  "deviceAssetNumber"
];

export const emptyRecord = (): AccountabilityRecord => ({
  no: "",
  empId: "",
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  position: "",
  group: "",
  department: "",
  opCen: "",
  division: "",
  project: "",
  costCenter: "",
  projectLocation: "",
  employmentStatus: "",
  deviceType: "",
  deviceDescription: "",
  hostname: "",
  serialNumber: "",
  deviceCondition: "",
  deviceAssetNumber: "",
  monitorModel: "",
  monitorSerialNumber: "",
  monitorAssetNumber: "",
  tarf: "",
  softwareName: "",
  softwareLicense: "",
  phr: "",
  amld: "",
  it: "",
  cato: ""
});

