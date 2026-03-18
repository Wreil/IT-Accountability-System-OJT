import { FormEvent, useEffect, useMemo, useState } from "react";
import { AccountabilityRecord } from "../types/accountability";
import {
  BorrowingReceiptData,
  emptyBorrowingReceiptData
} from "../types/borrowingReceipt";

interface BorrowingReceiptFormProps {
  record: AccountabilityRecord | null;
  initialData: BorrowingReceiptData | null;
  onSave: (recordId: string, data: BorrowingReceiptData) => void;
}

export const BorrowingReceiptForm = ({
  record,
  initialData,
  onSave
}: BorrowingReceiptFormProps) => {
  const [form, setForm] = useState<BorrowingReceiptData>(emptyBorrowingReceiptData());

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      return;
    }

    setForm((prev) => ({
      ...emptyBorrowingReceiptData(),
      expectedReturnDate: prev.expectedReturnDate,
      requestedBy: prev.requestedBy,
      approvedBy: prev.approvedBy,
      releasedBy: prev.releasedBy
    }));
  }, [initialData]);

  useEffect(() => {
    if (!record) return;

    setForm((prev) => ({
      ...prev,
      expectedReturnDate: prev.expectedReturnDate || record.returnedDate || "",
      contact: prev.contact || record.email || "",
      requestedBy: prev.requestedBy || [record.firstName, record.lastName].filter(Boolean).join(" "),
      approvedBy: prev.approvedBy || record.phr || "",
      releasedBy: prev.releasedBy || record.cato || record.it || ""
    }));
  }, [record]);

  const borrowerName = useMemo(() => {
    if (!record) return "-";
    return [record.firstName, record.middleName, record.lastName].filter(Boolean).join(" ") || "-";
  }, [record]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!record?.id) return;
    onSave(record.id, form);
  };

  if (!record?.id) {
    return (
      <section className="panel">
        <h2>Borrowing Receipt Form</h2>
        <p className="helper-text">
          Select a record in Records first, then click Borrowing to fill this section.
        </p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>Borrowing Receipt Form</h2>
      <p className="helper-text">
        Filling for <strong>{record.empId}</strong> - <strong>{borrowerName}</strong>
      </p>

      <form onSubmit={handleSubmit} className="form-grid">
        <label className="field">
          <span>Borrowing No.</span>
          <input
            value={form.borrowingNo}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, borrowingNo: event.target.value }))
            }
            placeholder="BR-2026-0001"
          />
        </label>

        <label className="field">
          <span>Date Borrowed</span>
          <input
            type="date"
            value={form.dateBorrowed}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, dateBorrowed: event.target.value }))
            }
          />
        </label>

        <label className="field">
          <span>Expected Return Date</span>
          <input
            type="date"
            value={form.expectedReturnDate}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, expectedReturnDate: event.target.value }))
            }
          />
        </label>

        <label className="field">
          <span>Purpose</span>
          <input
            value={form.purpose}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, purpose: event.target.value }))
            }
            placeholder="Official business / temporary deployment"
          />
        </label>

        <label className="field">
          <span>Contact</span>
          <input
            value={form.contact}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, contact: event.target.value }))
            }
            placeholder="Email or mobile"
          />
        </label>

        <label className="field">
          <span>Accessories Included</span>
          <input
            value={form.accessoriesIncluded}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, accessoriesIncluded: event.target.value }))
            }
            placeholder="Charger, bag, mouse"
          />
        </label>

        <label className="field">
          <span>Requested By</span>
          <input
            value={form.requestedBy}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, requestedBy: event.target.value }))
            }
          />
        </label>

        <label className="field">
          <span>Approved By</span>
          <input
            value={form.approvedBy}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, approvedBy: event.target.value }))
            }
          />
        </label>

        <label className="field">
          <span>Released By (IT/Warehouse)</span>
          <input
            value={form.releasedBy}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, releasedBy: event.target.value }))
            }
          />
        </label>

        <label className="field">
          <span>Release Date/Time</span>
          <input
            type="datetime-local"
            value={form.releaseDateTime}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, releaseDateTime: event.target.value }))
            }
          />
        </label>

        <label className="field field-span">
          <span>Damage / Missing Items</span>
          <textarea
            rows={3}
            value={form.damageOrMissingItems}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, damageOrMissingItems: event.target.value }))
            }
            placeholder="Leave blank if none"
          />
        </label>

        <label className="field field-span">
          <span>Return Remarks</span>
          <textarea
            rows={3}
            value={form.returnRemarks}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, returnRemarks: event.target.value }))
            }
            placeholder="Condition and notes upon return"
          />
        </label>

        <div className="actions">
          <button type="submit">Save and Print Borrowing Receipt</button>
        </div>
      </form>
    </section>
  );
};
