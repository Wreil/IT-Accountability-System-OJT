import { useMemo, useState } from "react";
import { AccountabilityRecord } from "../types/accountability";

interface RecordsListProps {
  records: AccountabilityRecord[];
  onEdit: (record: AccountabilityRecord) => void;
  onDelete: (record: AccountabilityRecord) => Promise<void>;
  onPrint: (record: AccountabilityRecord) => void;
  onView: (record: AccountabilityRecord) => void;
  onBorrowing: (record: AccountabilityRecord) => void;
  printActionType?: "accountability" | "borrowing" | null;
}

type SortKey = keyof AccountabilityRecord;

export const RecordsList = ({
  records,
  onEdit,
  onDelete,
  onPrint,
  onView,
  onBorrowing,
  printActionType
}: RecordsListProps) => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [project, setProject] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [ascending, setAscending] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AccountabilityRecord | null>(null);

  const options = useMemo(() => {
    const getUnique = (key: keyof AccountabilityRecord) =>
      Array.from(new Set(records.map((item) => String(item[key] ?? "")).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b)
      );

    return {
      departments: getUnique("department"),
      projects: getUnique("project")
    };
  }, [records]);

  const filtered = useMemo(() => {
    const lowered = search.toLowerCase();

    const base = records.filter((item) => {
      const searchable = [
        item.empId,
        item.firstName,
        item.middleName,
        item.lastName,
        item.department,
        item.project,
        item.hostname,
        item.serialNumber
      ]
        .join(" ")
        .toLowerCase();

      const bySearch = !lowered || searchable.includes(lowered);
      const byDepartment = !department || item.department === department;
      const byProject = !project || item.project === project;

      return bySearch && byDepartment && byProject;
    });

    return [...base].sort((a, b) => {
      const left = String(a[sortKey] ?? "").toLowerCase();
      const right = String(b[sortKey] ?? "").toLowerCase();
      const compared = left.localeCompare(right);
      return ascending ? compared : -compared;
    });
  }, [records, search, department, project, sortKey, ascending]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setAscending((prev) => !prev);
      return;
    }
    setSortKey(key);
    setAscending(true);
  };

  const activeRecord = selectedRecord ?? filtered[0] ?? null;

  return (
    <section className="panel records-with-sidebar">
      <div className="sidebar-actions">
        <button
          type="button"
          className="sidebar-btn accountability"
          onClick={() => {
            if (activeRecord) {
              onView(activeRecord);
            }
          }}
          title={activeRecord ? "Accountability Form" : "No records available"}
          aria-label="Open Accountability Form"
          disabled={!activeRecord}
        >
          <span className="icon">📝</span>
        </button>
        <button
          type="button"
          className="sidebar-btn borrowing"
          onClick={() => {
            if (activeRecord) {
              onBorrowing(activeRecord);
            }
          }}
          title={activeRecord ? "Borrowing & Receipt" : "No records available"}
          aria-label="Open Borrowing & Receipt"
          disabled={!activeRecord}
        >
          <span className="icon">🧾</span>
        </button>
      </div>
      <div className="records-main">
        <h2>Records</h2>
        <div className="filters">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by employee, project, hostname..."
        />

        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="">All Departments</option>
          {options.departments.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select value={project} onChange={(e) => setProject(e.target.value)}>
          <option value="">All Projects</option>
          {options.projects.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {printActionType && (
        <div className={`action-type-sidebar action-${printActionType}`}>
          <strong>Mode:</strong> {printActionType === "accountability" ? "Accountability Form" : "Borrowing & Receipt"}
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th><button type="button" onClick={() => toggleSort("empId")}>Emp ID</button></th>
              <th><button type="button" onClick={() => toggleSort("lastName")}>Name</button></th>
              <th><button type="button" onClick={() => toggleSort("department")}>Department</button></th>
              <th><button type="button" onClick={() => toggleSort("project")}>Project</button></th>
              <th>Attachments</th>
              <th><button type="button" onClick={() => toggleSort("updatedAt")}>Updated</button></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((record) => (
              <tr key={record.id} className={selectedRecord?.id === record.id ? "selected" : ""} onClick={() => setSelectedRecord(record)}>
                <td>{record.empId}</td>
                <td>{[record.firstName, record.middleName, record.lastName].filter(Boolean).join(" ")}</td>
                <td>{record.department}</td>
                <td>{record.project}</td>
                <td>{record.attachments?.length ?? 0}</td>
                <td>{record.updatedAt ? new Date(record.updatedAt).toLocaleString() : "-"}</td>
                <td className="row-actions">
                  <button type="button" onClick={(e) => { e.stopPropagation(); onView(record); }} title="View accountability form">View</button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); onEdit(record); }} title="Edit accountability record">Edit</button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); onBorrowing(record); }} title="Borrowing & Receipt">🧾 Borrow</button>
                  <button type="button" className="ghost" onClick={(e) => { e.stopPropagation(); void onDelete(record); }}>Delete</button>
                  <button type="button" className="print" onClick={(e) => { e.stopPropagation(); onPrint(record); }} title="Print accountability form">Print</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </section>
  );
};
