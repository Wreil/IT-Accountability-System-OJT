import { forwardRef } from "react";
import { AccountabilityRecord } from "../types/accountability";
import { BorrowingReceiptData } from "../types/borrowingReceipt";

interface BorrowingReceiptPrintableProps {
  record: AccountabilityRecord | null;
  data: BorrowingReceiptData;
}

const valueOrDash = (value?: string) => value?.trim() || "-";

export const BorrowingReceiptPrintable = forwardRef<
  HTMLDivElement,
  BorrowingReceiptPrintableProps
>(({ record, data }, ref) => {
  if (!record) {
    return (
      <section className="panel">
        <h2>Borrowing Receipt Printable</h2>
        <p className="helper-text">
          Select a record first, then open Borrowing Receipt to generate the A4 printable page.
        </p>
      </section>
    );
  }

  const fullName = [record.firstName, record.middleName, record.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="panel print-shell">
      <h2 className="no-print">Borrowing Receipt Printable Preview</h2>

      <div className="print-form print-form--a4 print-form--compact" ref={ref}>
        <header className="print-header">
          <div className="print-header-main">
            <div className="print-logo-wrap">
              <img
                src="/assets/mdclogo.png"
                alt="MDC Logo"
                className="print-logo"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div className="print-header-copy">
              <h1>IT ASSET BORROWING RECEIPT FORM</h1>
              <p>MAKATI DEVELOPMENT CORPORATION - Information Technology Division</p>
            </div>
          </div>
        </header>

        <table className="pf-table" style={{ marginTop: "6px" }}>
          <tbody>
            <tr>
              <td className="pf-lbl" style={{ width: "18%" }}>Borrowing No.</td>
              <td className="pf-val">{valueOrDash(data.borrowingNo)}</td>
              <td className="pf-lbl" style={{ width: "18%" }}>Date Borrowed</td>
              <td className="pf-val">{valueOrDash(data.dateBorrowed)}</td>
            </tr>
            <tr>
              <td className="pf-lbl">Expected Return Date</td>
              <td className="pf-val">{valueOrDash(data.expectedReturnDate || record.returnedDate)}</td>
              <td className="pf-lbl">Purpose</td>
              <td className="pf-val">{valueOrDash(data.purpose)}</td>
            </tr>
          </tbody>
        </table>

        <table className="pf-table" style={{ marginTop: "6px" }}>
          <thead>
            <tr>
              <th className="pf-th" colSpan={4}>Borrower Information</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pf-lbl" style={{ width: "18%" }}>Employee ID</td>
              <td className="pf-val">{valueOrDash(record.empId)}</td>
              <td className="pf-lbl" style={{ width: "18%" }}>Full Name</td>
              <td className="pf-val">{valueOrDash(fullName)}</td>
            </tr>
            <tr>
              <td className="pf-lbl">Department</td>
              <td className="pf-val">{valueOrDash(record.department)}</td>
              <td className="pf-lbl">Project</td>
              <td className="pf-val">{valueOrDash(record.project)}</td>
            </tr>
            <tr>
              <td className="pf-lbl">Contact</td>
              <td className="pf-val">{valueOrDash(data.contact || record.email)}</td>
              <td className="pf-lbl">Position</td>
              <td className="pf-val">{valueOrDash(record.position)}</td>
            </tr>
          </tbody>
        </table>

        <table className="pf-table" style={{ marginTop: "6px" }}>
          <thead>
            <tr>
              <th className="pf-th" colSpan={5}>Asset Details</th>
            </tr>
            <tr>
              <th className="pf-th">Device Type</th>
              <th className="pf-th">Description / Model</th>
              <th className="pf-th">Serial Number</th>
              <th className="pf-th">Asset Number</th>
              <th className="pf-th">Condition Before Release</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pf-val">{valueOrDash(record.deviceType)}</td>
              <td className="pf-val">{valueOrDash(record.deviceDescription || record.hostname)}</td>
              <td className="pf-val">{valueOrDash(record.serialNumber)}</td>
              <td className="pf-val">{valueOrDash(record.deviceAssetNumber)}</td>
              <td className="pf-val">{valueOrDash(record.deviceCondition)}</td>
            </tr>
            <tr>
              <td className="pf-lbl">Accessories Included</td>
              <td className="pf-val" colSpan={4}>{valueOrDash(data.accessoriesIncluded)}</td>
            </tr>
          </tbody>
        </table>

        <table className="pf-table" style={{ marginTop: "6px" }}>
          <thead>
            <tr>
              <th className="pf-th" colSpan={4}>Approval and Release</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pf-lbl" style={{ width: "18%" }}>Requested By</td>
              <td className="pf-val">{valueOrDash(data.requestedBy || fullName)}</td>
              <td className="pf-lbl" style={{ width: "18%" }}>Approved By</td>
              <td className="pf-val">{valueOrDash(data.approvedBy || record.phr)}</td>
            </tr>
            <tr>
              <td className="pf-lbl">Released By (IT/Warehouse)</td>
              <td className="pf-val">{valueOrDash(data.releasedBy || record.cato || record.it)}</td>
              <td className="pf-lbl">Release Date/Time</td>
              <td className="pf-val">{valueOrDash(data.releaseDateTime)}</td>
            </tr>
          </tbody>
        </table>

        <table className="pf-table" style={{ marginTop: "6px" }}>
          <thead>
            <tr>
              <th className="pf-th" colSpan={4}>Receipt and Return Confirmation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pf-lbl" style={{ width: "18%" }}>Borrower Signature</td>
              <td className="pf-val">{record.assigneeSignature?.signatureDataUrl ? "Signed" : "-"}</td>
              <td className="pf-lbl" style={{ width: "18%" }}>IT/Warehouse Signature</td>
              <td className="pf-val">{record.catoSignature?.signatureDataUrl ? "Signed" : "-"}</td>
            </tr>
            <tr>
              <td className="pf-lbl">Actual Return Date</td>
              <td className="pf-val">{valueOrDash(record.returnedDate)}</td>
              <td className="pf-lbl">Condition Upon Return</td>
              <td className="pf-val">{valueOrDash(record.deviceCondition)}</td>
            </tr>
            <tr>
              <td className="pf-lbl">Damage / Missing Items</td>
              <td className="pf-val" colSpan={3}>{valueOrDash(data.damageOrMissingItems)}</td>
            </tr>
            <tr>
              <td className="pf-lbl">Return Remarks</td>
              <td className="pf-val" colSpan={3}>{valueOrDash(data.returnRemarks)}</td>
            </tr>
          </tbody>
        </table>

        <footer className="print-footer">
          <p>
            IT Department - Makati Development Corporation | Generated: {new Date().toLocaleDateString("en-PH", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        </footer>
      </div>
    </section>
  );
});

BorrowingReceiptPrintable.displayName = "BorrowingReceiptPrintable";
