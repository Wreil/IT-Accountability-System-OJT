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
  division: string;
  project: string;
  costCenter: string;
  projectLocation: string;
  hostname: string;
  serialNumber: string;
  deviceAssetNumber: string;
  monitorModel: string;
  monitorSerialNumber: string;
  monitorAssetNumber: string;
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
  "division",
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
  division: "",
  project: "",
  costCenter: "",
  projectLocation: "",
  hostname: "",
  serialNumber: "",
  deviceAssetNumber: "",
  monitorModel: "",
  monitorSerialNumber: "",
  monitorAssetNumber: "",
  phr: "",
  amld: "",
  it: "",
  cato: ""
});
