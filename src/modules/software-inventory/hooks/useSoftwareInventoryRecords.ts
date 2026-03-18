import { useCallback, useEffect, useState } from "react";
import { SoftwareInventoryRecord } from "../types/softwareInventory";

const LOCAL_STORAGE_KEY = "ias-software-records";

const stampNow = () => new Date().toISOString();

const readLocal = (): SoftwareInventoryRecord[] => {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SoftwareInventoryRecord[];
  } catch {
    return [];
  }
};

const writeLocal = (records: SoftwareInventoryRecord[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
};

export const useSoftwareInventoryRecords = () => {
  const [records, setRecords] = useState<SoftwareInventoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecords = useCallback(() => {
    setLoading(true);
    const local = readLocal();
    setRecords(local);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const createRecord = async (record: SoftwareInventoryRecord) => {
    const payload: SoftwareInventoryRecord = {
      ...record,
      createdAt: stampNow(),
      updatedAt: stampNow(),
      id: crypto.randomUUID()
    };
    const next = [payload, ...records];
    setRecords(next);
    writeLocal(next);
  };

  const updateRecord = async (id: string, record: SoftwareInventoryRecord) => {
    const payload: SoftwareInventoryRecord = {
      ...record,
      id,
      updatedAt: stampNow()
    };

    const next = records.map((item) =>
      item.id === id
        ? {
            ...payload,
            createdAt: item.createdAt ?? stampNow()
          }
        : item
    );

    setRecords(next);
    writeLocal(next);
  };

  const removeRecord = async (id: string) => {
    const next = records.filter((item) => item.id !== id);
    setRecords(next);
    writeLocal(next);
  };

  return {
    records,
    loading,
    createRecord,
    updateRecord,
    removeRecord,
    reload: loadRecords
  };
};
