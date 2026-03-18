import { forwardRef } from "react";
import { AccountabilityRecord } from "../types/accountability";

interface PrintableFormProps {
  record: AccountabilityRecord | null;
}

const DEVICE_TYPES = ["Desktop", "Laptop", "Tablet", "Ipad", "Others"];

const Checkbox = ({ label, checked }: { label: string; checked: boolean }) => (
  <span style={{ marginRight: "10px", fontSize: "10px", whiteSpace: "nowrap" }}>
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

const formatAttachmentSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const isImageAttachment = (mimeType: string) => mimeType.startsWith("image/");
const isPdfAttachment = (mimeType: string) => mimeType === "application/pdf";

const dataUrlToBlob = (dataUrl: string) => {
  const parts = dataUrl.split(",");
  if (parts.length < 2) {
    return null;
  }

  const mimeMatch = parts[0].match(/data:(.*?);base64/);
  const mimeType = mimeMatch?.[1] || "application/octet-stream";
  const binary = atob(parts[1]);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mimeType });
};

const openAttachmentInNewTab = (dataUrl: string) => {
  const blob = dataUrlToBlob(dataUrl);
  if (!blob) {
    window.alert("Unable to open attachment preview.");
    return;
  }

  const blobUrl = URL.createObjectURL(blob);
  const opened = window.open(blobUrl, "_blank", "noopener,noreferrer");
  if (!opened) {
    window.alert("Pop-up blocked. Please allow pop-ups for this site.");
    URL.revokeObjectURL(blobUrl);
    return;
  }

  window.setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 60_000);
};

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
  const attachments = record.attachments ?? [];
  const assigneeName = [record.firstName, record.middleName, record.lastName]
    .filter(Boolean)
    .join(" ");
  const issuedDate = record.createdAt
    ? new Date(record.createdAt).toLocaleDateString("en-PH")
    : "-";

  return (
    <section className="panel print-shell">
      <h2 className="no-print">Printable Form Preview</h2>
      <div className="print-form print-form--a4 print-form--compact print-form--fill-page" ref={ref}>
        <section className={`pf-first-page${attachments.length > 0 ? " pf-first-page--with-attachments" : ""}`}>

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
              <td className="pf-lbl">Name:</td>
              <td className="pf-val" colSpan={3}>
                {[record.lastName, record.firstName, record.middleName].filter(Boolean).join(", ")}
              </td>
              <td className="pf-lbl">Employee ID:</td>
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
              <td className="pf-val pf-val--break" colSpan={2}>{record.email}</td>
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
              <td className="pf-val" style={{ fontSize: "9.5px" }}>
                <span className="pf-tarf-field">
                  <span className="pf-tarf-label">TARF Ref #:</span>
                  <span className="pf-tarf-value">{record.tarf || "-"}</span>
                </span>
              </td>
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
            <div className="pf-assignee-slot">
              <div className="pf-assignee-value">
                {record.assigneeSignature?.signatureDataUrl ? (
                  <img
                    src={record.assigneeSignature.signatureDataUrl}
                    alt="Assignee signature"
                    className="pf-assignee-sign-img"
                  />
                ) : null}
                <span>{assigneeName || "-"}</span>
              </div>
              <div className="pf-assignee-line" />
              <div className="pf-assignee-label">Assignee's Complete Name &amp; Signature</div>
            </div>
            <div className="pf-assignee-slot">
              <div className="pf-assignee-value">
                <span>{issuedDate}</span>
              </div>
              <div className="pf-assignee-line" />
              <div className="pf-assignee-label">Date</div>
            </div>
          </div>
        </div>

        {/* ── SIGNATURES ── */}
        <table className="pf-table pf-sigs" style={{ marginTop: "6px" }}>
          <thead>
            <tr>
              <th className="pf-th" colSpan={3}>Releasing Unit:</th>
              <th className="pf-th" colSpan={2}>Assignee</th>
              <th className="pf-th">Custodian</th>
            </tr>
            <tr>
              <th className="pf-th">HR/PHR Representative</th>
              <th className="pf-th">AMLD Representative</th>
              <th className="pf-th">IT Representative</th>
              <th className="pf-th">Received on</th>
              <th className="pf-th" colSpan={2}>Returned on</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pf-sig-cell" style={{ padding: "4px", verticalAlign: "center" }}>
                {record.phrSignature?.signatureDataUrl ? (
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={record.phrSignature.signatureDataUrl}
                      alt="PHR signature"
                      style={{ maxHeight: "34px", maxWidth: "100%", marginBottom: "2px" }}
                    />
                    <p style={{ margin: "2px 0", fontSize: "9px" }}>{record.phrSignature.date}</p>
                  </div>
                ) : (
                  ""
                )}
              </td>
              <td className="pf-sig-cell" style={{ padding: "4px", verticalAlign: "center" }}>
                {record.amldSignature?.signatureDataUrl ? (
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={record.amldSignature.signatureDataUrl}
                      alt="AMLD signature"
                      style={{ maxHeight: "34px", maxWidth: "100%", marginBottom: "2px" }}
                    />
                    <p style={{ margin: "2px 0", fontSize: "9px" }}>{record.amldSignature.date}</p>
                  </div>
                ) : (
                  ""
                )}
              </td>
              <td className="pf-sig-cell" style={{ padding: "4px", verticalAlign: "center" }}>
                {record.itSignature?.signatureDataUrl ? (
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={record.itSignature.signatureDataUrl}
                      alt="IT signature"
                      style={{ maxHeight: "34px", maxWidth: "100%", marginBottom: "2px" }}
                    />
                    <p style={{ margin: "2px 0", fontSize: "9px" }}>{record.itSignature.date}</p>
                  </div>
                ) : (
                  ""
                )}
              </td>
              <td className="pf-sig-cell" style={{ padding: "4px", verticalAlign: "center" }}>
                {record.assigneeSignature?.signatureDataUrl ? (
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={record.assigneeSignature.signatureDataUrl}
                      alt="Assignee signature"
                      style={{ maxHeight: "34px", maxWidth: "100%", marginBottom: "2px" }}
                    />
                    <p style={{ margin: "2px 0", fontSize: "9px" }}>{record.assigneeSignature.date}</p>
                  </div>
                ) : (
                  ""
                )}
              </td>
              <td className="pf-sig-cell" style={{ padding: "4px", verticalAlign: "center" }}>
                {record.assigneeReturnedSignature?.signatureDataUrl ? (
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={record.assigneeReturnedSignature.signatureDataUrl}
                      alt="Assignee returned signature"
                      style={{ maxHeight: "34px", maxWidth: "100%", marginBottom: "2px" }}
                    />
                    <p style={{ margin: "2px 0", fontSize: "9px" }}>
                      {record.returnedDate || record.assigneeReturnedSignature.date || ""}
                    </p>
                  </div>
                ) : (
                  <p style={{ margin: "2px 0", fontSize: "9px", textAlign: "center" }}>
                    {record.returnedDate || ""}
                  </p>
                )}
              </td>
              <td className="pf-sig-cell" style={{ padding: "4px", verticalAlign: "center" }}>
                {record.catoSignature?.signatureDataUrl ? (
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={record.catoSignature.signatureDataUrl}
                      alt="IT/Warehouse signature"
                      style={{ maxHeight: "34px", maxWidth: "100%", marginBottom: "2px" }}
                    />
                    <p style={{ margin: "2px 0", fontSize: "9px" }}>
                      {record.returnedDate || record.catoSignature.date || ""}
                    </p>
                    <p style={{ margin: "2px 0", fontSize: "9px" }}>
                      <strong>{record.cato || ""}</strong>
                    </p>
                  </div>
                ) : (
                  <p style={{ margin: "2px 0", fontSize: "9px", textAlign: "center" }}>
                    <strong>{record.cato || ""}</strong>
                  </p>
                )}
              </td>
            </tr>
            <tr>
              <td className="pf-sig-row-lbl">Name and Signature<br />Date</td>
              <td className="pf-sig-row-lbl">Name and Signature<br />Date</td>
              <td className="pf-sig-row-lbl">Name and Signature<br />Date</td>
              <td className="pf-sig-row-lbl">Date and Signature</td>
              <td className="pf-sig-row-lbl">Date and Signature</td>
              <td className="pf-sig-row-lbl">IT / Warehouse</td>
            </tr>
          </tbody>
        </table>

        <footer className="print-footer">
          <p>IT Department — Makati Development Corporation &nbsp;|&nbsp; Date Issued: {new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}</p>
        </footer>
        </section>

        {attachments.length > 0 && (
          <section className="print-page-break">
            <header className="print-header" style={{ marginTop: "0" }}>
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
                  <h1>IT ASSET ACCOUNTABILITY FORM - ATTACHMENTS</h1>
                  <p>MAKATI DEVELOPMENT CORPORATION — Information Technology Division</p>
                </div>
              </div>
            </header>

            <div>
              {attachments.map((file) => (
                <article className="pf-attachment-sheet" key={file.id}>
                  <div className="pf-attachment-meta">
                    <strong>{file.name}</strong>
                    <span>
                      {(file.type || "Unknown type")} | {formatAttachmentSize(file.size || 0)}
                    </span>
                  </div>

                  <div className="pf-attachment-link-row">
                    <button
                      type="button"
                      className="pf-attachment-link pf-attachment-link-btn no-print"
                      onClick={() => openAttachmentInNewTab(file.dataUrl)}
                    >
                      Open Attachment For Manual Printing
                    </button>
                  </div>

                  <div className="pf-attachment-body-full">
                    {isImageAttachment(file.type || "") && (
                      <img src={file.dataUrl} alt={file.name} className="pf-attachment-image-full" />
                    )}

                    {isPdfAttachment(file.type || "") && (
                      <iframe
                        src={`${file.dataUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                        className="pf-attachment-pdf-full"
                        title={file.name}
                      />
                    )}

                    {!isImageAttachment(file.type || "") && !isPdfAttachment(file.type || "") && (
                      <p className="pf-attachment-fallback">
                        Preview is unavailable for this file type.
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

      </div>
    </section>
  );
});

PrintableForm.displayName = "PrintableForm";

