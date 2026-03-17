import { FormEvent, useEffect, useMemo, useState } from "react";
import { AccountabilityRecord, emptyRecord, REQUIRED_FIELDS } from "../types/accountability";

interface EmployeeFormProps {
  editingRecord: AccountabilityRecord | null;
  onSubmit: (record: AccountabilityRecord) => Promise<void>;
  onCancelEdit: () => void;
}

const labels: Array<{ key: keyof AccountabilityRecord; label: string; type?: string }> = [
  { key: "no", label: "No" },
  { key: "empId", label: "Emp ID" },
  { key: "firstName", label: "Firstname" },
  { key: "middleName", label: "Middle Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email", type: "email" },
  { key: "position", label: "Position" },
  { key: "group", label: "Group" },
  { key: "department", label: "Department" },
  { key: "division", label: "Division" },
  { key: "project", label: "Project" },
  { key: "costCenter", label: "Cost Center" },
  { key: "projectLocation", label: "Project Location" },
  { key: "hostname", label: "Hostname" },
  { key: "serialNumber", label: "Serial Number" },
  { key: "deviceAssetNumber", label: "Asset Number (device)" },
  { key: "monitorModel", label: "Monitor Model" },
  { key: "monitorSerialNumber", label: "Monitor Serial Number" },
  { key: "monitorAssetNumber", label: "Asset Number (monitor)" },
  { key: "phr", label: "PHR" },
  { key: "amld", label: "AMLD" },
  { key: "it", label: "IT" },
  { key: "cato", label: "CATO" }
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
        {labels.map(({ key, label, type }) => {
          const required = REQUIRED_FIELDS.includes(key);
          return (
            <label key={key} className="field">
              <span>
                {label}
                {required ? " *" : ""}
              </span>
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
