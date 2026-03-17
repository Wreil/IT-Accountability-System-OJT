import { forwardRef } from "react";
import { AccountabilityRecord } from "../types/accountability";

interface PrintableFormProps {
  record: AccountabilityRecord | null;
}

const DEVICE_TYPES = ["Desktop", "Laptop", "Tablet", "Mobile Phone", "Others"];

const Checkbox = ({ label, checked }: { label: string; checked: boolean }) => (
  <span style={{ marginRight: "10px", fontSize: "9px", whiteSpace: "nowrap" }}>
    <span style={{
      display: "inline-block", width: "10px", height: "10px",
      border: "1px solid #000", marginRight: "2px",
      textAlign: "center", lineHeight: "9px", fontSize: "8px", verticalAlign: "middle"
    }}>
      {checked ? "✓" : ""}
    </span>
    {label}
  </span>
);

export const PrintableForm = forwardRef<HTMLDivElement, PrintableFormProps>(({ record }, ref) => {
  if (!record) {
    return (
      <section className="panel">
        <h2>Printable Form</h2>
        <p className="helper-text">Select a record from the table and click Print to generate the official MDC IT Assets Accountability Form.</p>
      </section>
    );
  }

  const hasMonitor = record.monitorSerialNumber?.trim();

  return (
    <section className="panel print-shell">
      <h2 className="no-print">Printable Form Preview</h2>
      <div className="print-form" ref={ref}>

        {/* ── HEADER ── */}
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
              <h1>IT ASSET ACCOUNTABILITY FORM</h1>
              <p>MAKATI DEVELOPMENT CORPORATION — Information Technology Division</p>
            </div>
          </div>
        </header>

        {/* ── PERSONAL INFO ── */}
        <table className="pf-table">
          <tbody>
            <tr>
              <td className="pf-lbl" style={{ width: "14%" }}>Name:</td>
              <td className="pf-val" colSpan={3}>
                {[record.lastName, record.firstName, record.middleName].filter(Boolean).join(", ")}
              </td>
              <td className="pf-lbl" style={{ width: "14%" }}>Employee ID:</td>
              <td className="pf-val">{record.empId}</td>
            </tr>
            <tr>
              <td className="pf-lbl">Last Name:</td>
              <td className="pf-val">{record.lastName}</td>
              <td className="pf-lbl">First Name:</td>
              <td className="pf-val">{record.firstName}</td>
              <td className="pf-lbl">Middle Name:</td>
              <td className="pf-val">{record.middleName}</td>
            </tr>
            <tr>
              <td className="pf-lbl">OpCen:</td>
              <td className="pf-val" colSpan={2}>{record.opCen}</td>
              <td className="pf-lbl">Employment Status:</td>
              <td className="pf-val" colSpan={2}>{record.employmentStatus}</td>
            </tr>
            <tr>
              <td className="pf-lbl">Group:</td>
              <td className="pf-val">{record.group}</td>
              <td className="pf-lbl">Department:</td>
              <td className="pf-val">{record.department}</td>
              <td className="pf-lbl">Position:</td>
              <td className="pf-val">{record.position}</td>
            </tr>
            <tr>
              <td className="pf-lbl">Project:</td>
              <td className="pf-val" colSpan={2}>{record.project}</td>
              <td className="pf-lbl">Email Account Assigned (Office 365):</td>
              <td className="pf-val" colSpan={2}>{record.email}</td>
            </tr>
            <tr>
              <td className="pf-lbl" style={{ verticalAlign: "middle" }}>Company Device Provision:</td>
              <td colSpan={5} className="pf-val" style={{ paddingTop: "4px", paddingBottom: "4px" }}>
                {DEVICE_TYPES.map((dt) => (
                  <Checkbox key={dt} label={dt} checked={record.deviceType === dt} />
                ))}
              </td>
            </tr>
            <tr>
              <td className="pf-lbl">Location of Asset:</td>
              <td className="pf-val" colSpan={2}>{record.projectLocation}</td>
              <td className="pf-lbl">Cost Center:</td>
              <td className="pf-val">{record.costCenter}</td>
              <td className="pf-val" style={{ fontSize: "8px" }}>TARF Ref #: {record.tarf}</td>
            </tr>
          </tbody>
        </table>

        {/* ── DEVICE TABLE ── */}
        <table className="pf-table pf-device" style={{ marginTop: "6px" }}>
          <thead>
            <tr>
              <th className="pf-th">Device Type</th>
              <th className="pf-th">Description / Device Model</th>
              <th className="pf-th">Serial Number</th>
              <th className="pf-th">Condition</th>
              <th className="pf-th">Asset Number</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pf-val">{record.deviceType}</td>
              <td className="pf-val">{record.deviceDescription || record.hostname}</td>
              <td className="pf-val">{record.serialNumber}</td>
              <td className="pf-val">{record.deviceCondition}</td>
              <td className="pf-val">{record.deviceAssetNumber}</td>
            </tr>
            {hasMonitor ? (
              <tr>
                <td className="pf-val">Monitor</td>
                <td className="pf-val">{record.monitorModel}</td>
                <td className="pf-val">{record.monitorSerialNumber}</td>
                <td className="pf-val"></td>
                <td className="pf-val">{record.monitorAssetNumber}</td>
              </tr>
            ) : (
              <tr>
                <td className="pf-val">&nbsp;</td>
                <td className="pf-val"></td>
                <td className="pf-val"></td>
                <td className="pf-val"></td>
                <td className="pf-val"></td>
              </tr>
            )}
            <tr>
              <td className="pf-val">&nbsp;</td>
              <td className="pf-val"></td>
              <td className="pf-val"></td>
              <td className="pf-val"></td>
              <td className="pf-val"></td>
            </tr>
          </tbody>
        </table>

        {/* ── SOFTWARE ACCOUNTABILITY ── */}
        <table className="pf-table pf-device" style={{ marginTop: "6px" }}>
          <thead>
            <tr>
              <th className="pf-th" colSpan={2} style={{ textAlign: "left" }}>
                Software Accountability (e.g. AutoDesk, Adobe, or other premium/subscription apps)
              </th>
            </tr>
            <tr>
              <th className="pf-th">Application Name (e.g. Adobe Acrobat Pro X)</th>
              <th className="pf-th">License / Reference #</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pf-val">{record.softwareName}&nbsp;</td>
              <td className="pf-val">{record.softwareLicense}&nbsp;</td>
            </tr>
            <tr>
              <td className="pf-val">&nbsp;</td>
              <td className="pf-val"></td>
            </tr>
          </tbody>
        </table>

        {/* ── LEGAL TEXT ── */}
        <div className="pf-legal">
          <p>All equipment and devices that has been issued to you is to be used only for business purposes related to company operations. You, as an MDC employee, are solely responsible for the equipment checked out to you and will be accountable to fund the replacement of any lost or damaged equipment in your care for any reason, such as theft or negligence.</p>
          <p>Portable devices and equipment issued to you is to be used only by you as assignee, only for official business purposes.</p>
          <p>Unless otherwise explicitly authorized by MDC Information Technology Division, all employees are prohibited from installing additional software or hardware into their assigned devices due to copyright and license agreements. Any additional software and hardware requirements will need to be requested through and approved by the IT Division.</p>
        </div>

        {/* ── CONFORME ── */}
        <div className="pf-conforme">
          <strong>CONFORME:</strong>
          <p>I hereby confirm that I have received the assets with the conditions indicated above in accordance with my role at Makati Development Corporation (MDC) and/or any of its subsidiary and partners. I acknowledge my accountability for the device hardware and software entrusted to me and will conform to all the information security policies set by the company, subject to all company &amp; government governing rules &amp; policies.</p>
          <div className="pf-assignee-sig">
            <span>Assignee's Complete Name &amp; Signature</span>
            <span>Releasing Unit:</span>
            <span>Date</span>
          </div>
        </div>

        {/* ── SIGNATURES ── */}
        <table className="pf-table pf-sigs" style={{ marginTop: "6px" }}>
          <thead>
            <tr>
              <th className="pf-th" style={{ width: "16%" }}></th>
              <th className="pf-th">Assignee</th>
              <th className="pf-th">HR/PHR Representative</th>
              <th className="pf-th">AMLD Representative</th>
              <th className="pf-th">IT Representative</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pf-sig-row-lbl">Received on<br />Custodian</td>
              <td className="pf-sig-cell"></td>
              <td className="pf-sig-cell"><strong>{record.phr}</strong></td>
              <td className="pf-sig-cell"><strong>{record.amld}</strong></td>
              <td className="pf-sig-cell"><strong>{record.it}</strong></td>
            </tr>
            <tr>
              <td className="pf-sig-row-lbl">Returned on</td>
              <td className="pf-sig-cell"></td>
              <td className="pf-sig-cell"></td>
              <td className="pf-sig-cell"></td>
              <td className="pf-sig-cell"><strong>{record.cato}</strong></td>
            </tr>
            <tr>
              <td className="pf-sig-row-lbl">Name and Signature<br />Date</td>
              <td className="pf-sig-cell"></td>
              <td className="pf-sig-cell"></td>
              <td className="pf-sig-cell"></td>
              <td className="pf-sig-cell"></td>
            </tr>
          </tbody>
        </table>

        <footer className="print-footer">
          <p>IT Department — Makati Development Corporation &nbsp;|&nbsp; Date Issued: {new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}</p>
        </footer>

      </div>
    </section>
  );
});

PrintableForm.displayName = "PrintableForm";

