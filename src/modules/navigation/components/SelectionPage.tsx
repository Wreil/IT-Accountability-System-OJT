interface SelectionPageProps {
  onSelect: (moduleKey: string) => void;
}

const MODULES = [
  { key: "it-accountability-form", label: "IT Accountability Form" },
  { key: "it-asset-inventory", label: "IT Asset Inventory" },
  { key: "it-software-inventory", label: "IT Software Inventory" },
  { key: "ipad-inventory", label: "IPAD Inventory" },
  { key: "disposal", label: "Disposal" },
  { key: "returned-assets", label: "Returned Assets" }
];

export const SelectionPage = ({ onSelect }: SelectionPageProps) => {
  return (
    <section className="selection-screen" aria-label="Module Selection Page">
      <div className="selection-content">
        <p className="selection-kicker">MDC IT</p>
        <h1>Select a Module</h1>
        <p className="selection-subtitle">Choose what you want to open.</p>

        <div className="selection-grid">
          {MODULES.map((item) => (
            <button
              key={item.key}
              type="button"
              className="selection-btn"
              onClick={() => onSelect(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
