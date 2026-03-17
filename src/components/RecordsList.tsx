import { useMemo, useState } from "react";
import { AccountabilityRecord } from "../types/accountability";

interface RecordsListProps {
  records: AccountabilityRecord[];
  onEdit: (record: AccountabilityRecord) => void;
  onDelete: (record: AccountabilityRecord) => Promise<void>;
  onPrint: (record: AccountabilityRecord) => void;
  onView: (record: AccountabilityRecord) => void;
}

type SortKey = keyof AccountabilityRecord;

export const RecordsList = ({ records, onEdit, onDelete, onPrint, onView }: RecordsListProps) => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [division, setDivision] = useState("");
  const [project, setProject] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [ascending, setAscending] = useState(false);

  const options = useMemo(() => {
    const getUnique = (key: keyof AccountabilityRecord) =>
      Array.from(new Set(records.map((item) => String(item[key] ?? "")).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b)
      );

    return {
      departments: getUnique("department"),
      divisions: getUnique("division"),
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
        item.division,
        item.project,
        item.hostname,
        item.serialNumber
      ]
        .join(" ")
        .toLowerCase();

      const bySearch = !lowered || searchable.includes(lowered);
      const byDepartment = !department || item.department === department;
      const byDivision = !division || item.division === division;
      const byProject = !project || item.project === project;

      return bySearch && byDepartment && byDivision && byProject;
    });

    return [...base].sort((a, b) => {
      const left = String(a[sortKey] ?? "").toLowerCase();
      const right = String(b[sortKey] ?? "").toLowerCase();
      const compared = left.localeCompare(right);
      return ascending ? compared : -compared;
    });
  }, [records, search, department, division, project, sortKey, ascending]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setAscending((prev) => !prev);
      return;
    }
    setSortKey(key);
    setAscending(true);
  };

  return (
    <section className="panel">
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

        <select value={division} onChange={(e) => setDivision(e.target.value)}>
          <option value="">All Divisions</option>
          {options.divisions.map((option) => (
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

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th><button type="button" onClick={() => toggleSort("empId")}>Emp ID</button></th>
              <th><button type="button" onClick={() => toggleSort("lastName")}>Name</button></th>
              <th><button type="button" onClick={() => toggleSort("department")}>Department</button></th>
              <th><button type="button" onClick={() => toggleSort("division")}>Division</button></th>
              <th><button type="button" onClick={() => toggleSort("project")}>Project</button></th>
              <th><button type="button" onClick={() => toggleSort("updatedAt")}>Updated</button></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((record) => (
              <tr key={record.id}>
                <td>{record.empId}</td>
                <td>{[record.firstName, record.middleName, record.lastName].filter(Boolean).join(" ")}</td>
                <td>{record.department}</td>
                <td>{record.division}</td>
                <td>{record.project}</td>
                <td>{record.updatedAt ? new Date(record.updatedAt).toLocaleString() : "-"}</td>
                <td className="row-actions">
                  <button type="button" onClick={() => onView(record)}>View</button>
                  <button type="button" onClick={() => onEdit(record)}>Edit</button>
                  <button type="button" className="ghost" onClick={() => void onDelete(record)}>Delete</button>
                  <button type="button" className="print" onClick={() => onPrint(record)}>Print</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
