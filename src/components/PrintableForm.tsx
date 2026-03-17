import { forwardRef } from "react";
import { AccountabilityRecord } from "../types/accountability";

interface PrintableFormProps {
  record: AccountabilityRecord | null;
}

const row = (label: string, value: string) => (
  <div className="print-row" key={label}>
    <span>{label}</span>
    <strong>{value || " "}</strong>
  </div>
);

export const PrintableForm = forwardRef<HTMLDivElement, PrintableFormProps>(({ record }, ref) => {
  if (!record) {
    return (
      <section className="panel">
        <h2>Printable Form</h2>
        <p>Select a record and click View or Print.</p>
      </section>
    );
  }

  const fullName = [record.firstName, record.middleName, record.lastName].filter(Boolean).join(" ");

  return (
    <section className="panel print-shell">
      <h2 className="no-print">Printable Form Preview</h2>
      <div className="print-form" ref={ref}>
        <header className="print-header">
          <h1>IT Assets Accountability Form</h1>
          <p>MAKATI DEVELOPMENT CORPORATION</p>
        </header>

        <div className="print-grid">
          {row("Name", fullName)}
          {row("Employee ID", record.empId)}
          {row("Email", record.email)}
          {row("Position", record.position)}
          {row("Group", record.group)}
          {row("Department", record.department)}
          {row("Division", record.division)}
          {row("Project", record.project)}
          {row("Cost Center", record.costCenter)}
          {row("Project Location", record.projectLocation)}
          {row("Hostname", record.hostname)}
          {row("Device Serial Number", record.serialNumber)}
          {row("Device Asset Number", record.deviceAssetNumber)}
          {row("Monitor Model", record.monitorModel)}
          {row("Monitor Serial Number", record.monitorSerialNumber)}
          {row("Monitor Asset Number", record.monitorAssetNumber)}
        </div>

        <section className="print-signatures">
          <div>
            <span>PHR</span>
            <strong>{record.phr || " "}</strong>
          </div>
          <div>
            <span>AMLD</span>
            <strong>{record.amld || " "}</strong>
          </div>
          <div>
            <span>IT</span>
            <strong>{record.it || " "}</strong>
          </div>
          <div>
            <span>CATO</span>
            <strong>{record.cato || " "}</strong>
          </div>
        </section>

        <footer className="print-footer">
          <p>
            Employee confirms accountability for all assigned assets and agrees to proper handling,
            security policy compliance, and replacement liability for loss or damage.
          </p>
        </footer>
      </div>
    </section>
  );
});

PrintableForm.displayName = "PrintableForm";
