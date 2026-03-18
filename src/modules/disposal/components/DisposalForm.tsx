import { FormEvent, useEffect, useMemo, useState } from "react";
import { DisposalRecord, emptyDisposalRecord } from "../types/disposal";

interface DisposalFormProps {
  editingRecord: DisposalRecord | null;
  onSubmit: (record: DisposalRecord) => void;
  onCancelEdit: () => void;
}

type DisposalField =
  | { key: keyof DisposalRecord; label: string; type?: string }
  | { key: keyof DisposalRecord; label: string; type: "select"; options: string[] };

const fields: DisposalField[] = [
  { key: "disposalNo", label: "Disposal No." },
  { key: "empId", label: "Employee ID" },
  { key: "employeeName", label: "Employee Name" },
  {
    key: "department",
    label: "Department",
    type: "select",
    options: ["", "IT", "Procore", "QS", "BIMD", "AMLD", "PHR", "Finance"]
  },
  { key: "project", label: "Project" },
  {
    key: "deviceType",
    label: "Device Type",
    type: "select",
    options: ["", "Desktop", "Laptop", "Tablet", "Ipad", "Others"]
  },
  { key: "serialNumber", label: "Serial Number" },
  { key: "assetNumber", label: "Asset Number" },
  {
    key: "conditionAtDisposal",
    label: "Condition at Disposal",
    type: "select",
    options: ["", "Working", "For Repair", "Beyond Repair", "Lost"]
  },
  {
    key: "disposalReason",
    label: "Disposal Reason",
    type: "select",
    options: ["", "Obsolete", "Damaged", "Lost", "Beyond Economic Repair", "Upgrade / Replacement"]
  },
  {
    key: "recommendedAction",
    label: "Recommended Action",
    type: "select",
    options: ["", "Recycle", "Scrap", "Auction", "Donate", "Return to Vendor"]
  },
  {
    key: "dataWipeRequired",
    label: "Data Wipe Required",
    type: "select",
    options: ["No", "Yes"]
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["Draft", "For Review", "For Approval", "Approved", "Disposed", "Rejected"]
  },
  { key: "requestedBy", label: "Requested By" },
  { key: "approvedBy", label: "Approved By" },
  { key: "requestedDate", label: "Requested Date", type: "date" },
  { key: "disposalDate", label: "Disposal Date", type: "date" }
];

const REQUIRED_KEYS: Array<keyof DisposalRecord> = [
  "empId",
  "employeeName",
  "deviceType",
  "serialNumber",
  "assetNumber",
  "disposalReason",
  "recommendedAction",
  "requestedBy",
  "requestedDate"
];

export const DisposalForm = ({ editingRecord, onSubmit, onCancelEdit }: DisposalFormProps) => {
  const [form, setForm] = useState<DisposalRecord>(emptyDisposalRecord());
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!editingRecord) {
      setForm(emptyDisposalRecord());
      setErrors([]);
      return;
    }

    setForm(editingRecord);
    setErrors([]);
  }, [editingRecord]);

  const preview = useMemo(() => {
    if (!form.employeeName.trim()) {
      return "-";
    }
    return form.employeeName;
  }, [form.employeeName]);

  const validate = () => {
    const nextErrors: string[] = [];
    REQUIRED_KEYS.forEach((key) => {
      if (!String(form[key] ?? "").trim()) {
        nextErrors.push(`${key} is required.`);
      }
    });

    setErrors(nextErrors);
    return nextErrors.length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    const now = new Date().toISOString();
    onSubmit({
      ...form,
      createdAt: form.createdAt || now,
      updatedAt: now
    });

    if (!editingRecord) {
      setForm(emptyDisposalRecord());
    }
  };

  return (
    <section className="panel">
      <h2>{editingRecord ? "Edit Disposal Form" : "Create Disposal Form"}</h2>
      <p className="helper-text">Employee Preview: <strong>{preview}</strong></p>

      {errors.length > 0 && (
        <div className="error-box">
          {errors.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        {fields.map((field) => {
          const { key, label, type } = field;
          const isSelect = type === "select";
          const isRequired = REQUIRED_KEYS.includes(key);
          return (
            <label key={key} className="field">
              <span>
                {label}
                {isRequired ? " *" : ""}
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
                  {(field as { options: string[] }).options.map((option) => (
                    <option key={option} value={option}>
                      {option || `Select ${label}`}
                    </option>
                  ))}
                </select>
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
                  placeholder={label}
                />
              )}
            </label>
          );
        })}

        <label className="field field-span">
          <span>Notes</span>
          <textarea
            rows={4}
            value={form.notes}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                notes: event.target.value
              }))
            }
            placeholder="Add disposal remarks, evidence references, or approval notes..."
          />
        </label>

        <div className="actions">
          <button type="submit">{editingRecord ? "Update Disposal" : "Save Disposal"}</button>
          {editingRecord && (
            <button type="button" className="ghost" onClick={onCancelEdit}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </section>
  );
};
