export interface BorrowingReceiptData {
  borrowingNo: string;
  dateBorrowed: string;
  expectedReturnDate: string;
  purpose: string;
  contact: string;
  accessoriesIncluded: string;
  requestedBy: string;
  approvedBy: string;
  releasedBy: string;
  releaseDateTime: string;
  damageOrMissingItems: string;
  returnRemarks: string;
}

export const emptyBorrowingReceiptData = (): BorrowingReceiptData => ({
  borrowingNo: "",
  dateBorrowed: "",
  expectedReturnDate: "",
  purpose: "",
  contact: "",
  accessoriesIncluded: "",
  requestedBy: "",
  approvedBy: "",
  releasedBy: "",
  releaseDateTime: "",
  damageOrMissingItems: "",
  returnRemarks: ""
});
