import { FormEvent, useEffect, useMemo, useState } from "react";
import { AccountabilityRecord, emptyRecord, REQUIRED_FIELDS } from "../types/accountability";

interface EmployeeFormProps {
  editingRecord: AccountabilityRecord | null;
  onSubmit: (record: AccountabilityRecord) => Promise<void>;
  onCancelEdit: () => void;
}

type FieldDef =
  | { key: keyof AccountabilityRecord; label: string; type?: string }
  | { key: keyof AccountabilityRecord; label: string; type: "select"; options: string[] };

const labels: FieldDef[] = [
  { key: "no", label: "No." },
  { key: "empId", label: "Employee ID" },
  { key: "lastName", label: "Last Name" },
  { key: "firstName", label: "First Name" },
  { key: "middleName", label: "Middle Name" },
  { key: "email", label: "Email (Office 365)", type: "email" },
  { key: "position", label: "Position" },
  { key: "group", label: "Group" },
  { key: "department", label: "Department" },
  { key: "opCen", label: "OpCen" },
  { key: "employmentStatus", label: "Employment Status" },
  { key: "project", label: "Project" },
  { key: "costCenter", label: "Cost Center" },
  { key: "projectLocation", label: "Location of Asset (Project/Address)" },
  { key: "tarf", label: "TARF Reference # (if applicable)" },
  { key: "deviceType", label: "Device Type", type: "select", options: ["", "Desktop", "Laptop", "Tablet", "Mobile Phone", "Others"] },
  { key: "deviceDescription", label: "Description / Device Model" },
  { key: "hostname", label: "Hostname" },
  { key: "serialNumber", label: "Serial Number" },
  { key: "deviceCondition", label: "Device Condition", type: "select", options: ["", "New", "Old"] },
  { key: "deviceAssetNumber", label: "Asset Number (Device)" },
  { key: "monitorModel", label: "Monitor Model" },
  { key: "monitorSerialNumber", label: "Monitor Serial Number" },
  { key: "monitorAssetNumber", label: "Asset Number (Monitor)" },
  { key: "softwareName", label: "Software Application Name" },
  { key: "softwareLicense", label: "Software License / Reference #" },
  { key: "phr", label: "HR/PHR Representative" },
  { key: "amld", label: "AMLD Representative" },
  { key: "it", label: "IT Representative" },
  { key: "cato", label: "CATO" },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EmployeeForm = ({ editingRecord, onSubmit, onCancelEdit }: EmployeeFormProps) => {
  const [form, setForm] = useState<AccountabilityRecord>(emptyRecord());
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(editingRecord ? { ...editingRecord } : emptyRecord());
    setErrors([]);
  }, [editingRecord]);

  const fullName = useMemo(
    () => [form.firstName, form.middleName, form.lastName].filter(Boolean).join(" "),
    [form.firstName, form.middleName, form.lastName]
  );

  const validate = () => {
    const nextErrors: string[] = [];

    REQUIRED_FIELDS.forEach((field) => {
      if (!String(form[field] ?? "").trim()) {
        nextErrors.push(`${field} is required.`);
      }
    });

    if (form.email.trim() && !emailRegex.test(form.email.trim())) {
      nextErrors.push("email must be a valid email address.");
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
        setForm(emptyRecord());
      }
      setErrors([]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="panel">
      <h2>{editingRecord ? "Edit Accountability Record" : "Create Accountability Record"}</h2>
      <p className="helper-text">Full Name Preview: <strong>{fullName || "-"}</strong></p>

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
          const required = REQUIRED_FIELDS.includes(key);
          const isSelect = type === "select";
          const options = isSelect ? (fieldDef as { options: string[] }).options : [];
          return (
            <label key={key} className="field">
              <span>
                {label}
                {required ? " *" : ""}
              </span>
              {isSelect ? (
                <select
                  value={String(form[key] ?? "")}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                >
                  {options.map((o) => (
                    <option key={o} value={o}>
                      {o || `Select ${label}`}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={type ?? "text"}
                  value={String(form[key] ?? "")}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [key]: e.target.value
                    }))
                  }
                  placeholder={label}
                />
              )}
            </label>
          );
        })}

        <div className="actions">
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : editingRecord ? "Update Record" : "Save Record"}
          </button>
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
