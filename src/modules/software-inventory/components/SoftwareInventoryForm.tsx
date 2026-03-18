import { FormEvent, useEffect, useState } from "react";
import {
  SoftwareInventoryRecord,
  SOFTWARE_REQUIRED_FIELDS,
  emptySoftwareRecord
} from "../types/softwareInventory";
import { SignaturePad } from "../../accountability/components/SignaturePad";

interface SoftwareInventoryFormProps {
  editingRecord: SoftwareInventoryRecord | null;
  onSubmit: (record: SoftwareInventoryRecord) => Promise<void>;
  onCancelEdit: () => void;
}

type FieldDef =
  | { key: keyof SoftwareInventoryRecord; label: string; type?: string }
  | {
      key: keyof SoftwareInventoryRecord;
      label: string;
      type: "select";
      options: string[];
    };

const labels: FieldDef[] = [
  { key: "formNo", label: "Form No." },
  { key: "softwareName", label: "Software Name" },
  { key: "softwareVersion", label: "Software Version" },
  { key: "vendor", label: "Vendor / Publisher" },
  { key: "licenseType", label: "License Type / Model" },
  { key: "licenseReference", label: "License / Reference No." },
  { key: "seatsPurchased", label: "Seats Purchased", type: "number" },
  { key: "seatsUsed", label: "Seats Used", type: "number" },
  { key: "assignedTo", label: "Assigned To" },
  { key: "employeeId", label: "Employee ID" },
  { key: "department", label: "Department" },
  { key: "hostname", label: "Device Hostname" },
  { key: "requestTicket", label: "Request Ticket No." },
  { key: "preparedBy", label: "Prepared By" },
  { key: "approvedBy", label: "Approved By" },
  { key: "expiryDate", label: "Expiry / Renewal Date", type: "date" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["", "Active", "Expiring Soon", "Expired", "Suspended"]
  },
  { key: "remarks", label: "Remarks" }
];

export const SoftwareInventoryForm = ({
  editingRecord,
  onSubmit,
  onCancelEdit
}: SoftwareInventoryFormProps) => {
  const [form, setForm] = useState<SoftwareInventoryRecord>(emptySoftwareRecord());
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editingRecord) {
      setForm(emptySoftwareRecord());
      setErrors([]);
      return;
    }

    const base = emptySoftwareRecord();
    setForm({
      ...base,
      ...editingRecord,
      preparedSignature: editingRecord.preparedSignature ?? base.preparedSignature,
      approvedSignature: editingRecord.approvedSignature ?? base.approvedSignature
    });
    setErrors([]);
  }, [editingRecord]);

  const handleSignatureSave = (
    role: "prepared" | "approved",
    signatureDataUrl: string
  ) => {
    const field = role === "prepared" ? "preparedSignature" : "approvedSignature";
    const signatureName =
      role === "prepared" ? form.preparedBy.trim() : form.approvedBy.trim();

    setForm((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] ?? { name: "", signatureDataUrl: null, date: "" }),
        name: signatureName,
        signatureDataUrl,
        date: new Date().toISOString().split("T")[0]
      }
    }));
  };

  const validate = () => {
    const nextErrors: string[] = [];

    SOFTWARE_REQUIRED_FIELDS.forEach((field) => {
      if (!String(form[field] ?? "").trim()) {
        nextErrors.push(`${field} is required.`);
      }
    });

    const purchased = Number(form.seatsPurchased || 0);
    const used = Number(form.seatsUsed || 0);
    if (used > purchased && purchased > 0) {
      nextErrors.push("seatsUsed cannot be greater than seatsPurchased.");
    }

    setErrors(nextErrors);
    return nextErrors.length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      await onSubmit(form);
      if (!editingRecord) {
        setForm(emptySoftwareRecord());
      }
      setErrors([]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="panel">
      <h2>{editingRecord ? "Edit Software Inventory Form" : "Create Software Inventory Form"}</h2>
      <p className="helper-text">
        Encode software details, then use Records to print or download the generated form.
      </p>
      <p className="helper-text">
        For SAP, use software name as SAP and set license type/model as needed (for example: Named User, Concurrent User, Engine/Package, Enterprise Agreement).
      </p>

      {errors.length > 0 && (
        <div className="error-box">
          {errors.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        {labels.map((fieldDef) => {
          const { key, label, type } = fieldDef;
          const required = SOFTWARE_REQUIRED_FIELDS.includes(key);
          const isSelect = type === "select";
          const isRemarks = key === "remarks";
          const options = isSelect ? (fieldDef as { options: string[] }).options : [];

          return (
            <label key={key} className={`field${isRemarks ? " field-span" : ""}`}>
              <span>
                {label}
                {required ? " *" : ""}
              </span>

              {isSelect ? (
                <select
                  value={String(form[key] ?? "")}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      [key]: event.target.value
                    }))
                  }
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option || `Select ${label}`}
                    </option>
                  ))}
                </select>
              ) : isRemarks ? (
                <textarea
                  value={String(form[key] ?? "")}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      [key]: event.target.value
                    }))
                  }
                  placeholder={label}
                  rows={3}
                />
              ) : (
                <input
                  type={type ?? "text"}
                  value={String(form[key] ?? "")}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      [key]: event.target.value
                    }))
                  }
                  placeholder={
                    key === "licenseType"
                      ? "e.g. Named User, Concurrent User, Engine/Package"
                      : label
                  }
                />
              )}
            </label>
          );
        })}

        <div className="actions">
          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingRecord
                ? "Update Software Form"
                : "Save Software Form"}
          </button>

          {editingRecord && (
            <button type="button" className="ghost" onClick={onCancelEdit}>
              Cancel Edit
            </button>
          )}
        </div>

        <section
          className="field field-span"
          style={{
            padding: "16px",
            backgroundColor: "#f5f5f5",
            borderRadius: "6px",
            borderLeft: "4px solid #3b82f6"
          }}
        >
          <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: 600 }}>
            Signature Information (Optional)
          </h3>
          <p className="helper-text" style={{ marginBottom: "16px" }}>
            Signatures will appear in the printable software inventory form.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(260px, 1fr))",
              gap: "12px"
            }}
          >
            <SignaturePad
              label="Prepared By Signature"
              existingSignature={form.preparedSignature?.signatureDataUrl}
              onSave={(sig) => handleSignatureSave("prepared", sig)}
            />

            <SignaturePad
              label="Approved By Signature"
              existingSignature={form.approvedSignature?.signatureDataUrl}
              onSave={(sig) => handleSignatureSave("approved", sig)}
            />
          </div>
        </section>
      </form>
    </section>
  );
};
