import { useMemo, useState } from "react";
import { AccountabilityRecord } from "../../accountability/types/accountability";

interface ITAssetInventoryProps {
  records: AccountabilityRecord[];
  loading: boolean;
  onRefresh: () => Promise<void> | void;
}

const normalize = (value: string) => value.trim().toLowerCase();

export const ITAssetInventory = ({ records, loading, onRefresh }: ITAssetInventoryProps) => {
  const [hostnameSearch, setHostnameSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deviceTypeFilter, setDeviceTypeFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  const options = useMemo(() => {
    const unique = (items: string[]) => Array.from(new Set(items.filter(Boolean))).sort((a, b) => a.localeCompare(b));

    return {
      status: unique(records.map((item) => item.deviceCondition)),
      deviceTypes: unique(records.map((item) => item.deviceType)),
      projects: unique(records.map((item) => item.project))
    };
  }, [records]);

  const filtered = useMemo(() => {
    const hostname = normalize(hostnameSearch);

    return records.filter((item) => {
      const byHostname = !hostname || normalize(item.hostname).includes(hostname);
      const byStatus = !statusFilter || item.deviceCondition === statusFilter;
      const byDeviceType = !deviceTypeFilter || item.deviceType === deviceTypeFilter;
      const byProject = !projectFilter || item.project === projectFilter;

      return byHostname && byStatus && byDeviceType && byProject;
    });
  }, [records, hostnameSearch, statusFilter, deviceTypeFilter, projectFilter]);

  return (
    <section className="panel">
      <h2>IT Asset Inventory</h2>
      <p className="helper-text">Asset inventory view with quick filters and hostname search.</p>

      <div className="inventory-toolbar">
        <input
          value={hostnameSearch}
          onChange={(event) => setHostnameSearch(event.target.value)}
          placeholder="Search by hostname..."
        />

        <button type="button" className="ghost" onClick={() => void onRefresh()}>
          Refresh
        </button>

        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="">All Status</option>
          {options.status.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <select value={deviceTypeFilter} onChange={(event) => setDeviceTypeFilter(event.target.value)}>
          <option value="">All Device Types</option>
          {options.deviceTypes.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <select value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)}>
          <option value="">All Projects</option>
          {options.projects.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <section className="inventory-table-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Hostname</th>
                <th>Employee</th>
                <th>Device Type</th>
                <th>Status</th>
                <th>Project</th>
                <th>Serial Number</th>
                <th>Asset Number</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr key={record.id ?? `${record.empId}-${record.hostname}`}>
                  <td>{record.hostname}</td>
                  <td>{[record.firstName, record.lastName].filter(Boolean).join(" ")}</td>
                  <td>{record.deviceType || "-"}</td>
                  <td>{record.deviceCondition || "-"}</td>
                  <td>{record.project || "-"}</td>
                  <td>{record.serialNumber || "-"}</td>
                  <td>{record.deviceAssetNumber || "-"}</td>
                  <td>{record.updatedAt ? new Date(record.updatedAt).toLocaleString() : "-"}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8}>No assets found for current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {loading && <p className="warning-text">Refreshing records...</p>}
      </section>
    </section>
  );
};
