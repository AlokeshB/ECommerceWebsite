import { React, useState } from "react";
import { Filter, Tag, Star, LayoutGrid, ChevronDown, ChevronRight } from "lucide-react";
import { CATEGORY_DATA, TECHNICAL_FILTERS } from "./categories";
const Sidebar = () => {
  const [price, setPrice] = useState(2500);
  const min = 0;
  const max = 10000;

  // Calculate percentage to position the tooltip accurately
  const getPlacement = () => ((price - min) / (max - min)) * 100;

  const [openSections, setOpenSections] = useState({
    women: true, // Default open
    fabric: true,
  });

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      className="bg-white border-end h-100 p-3 overflow-auto"
      style={{ minWidth: "260px", height: "calc(100vh - 80px)" }}
    //   {...props}
    >
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h6 className="fw-bold mb-0 d-flex align-items-center gap-2 text-primary">
          <Filter size={20} /> Filters
        </h6>
        <span className="text-muted small" style={{ cursor: "pointer" }}>
          Clear All
        </span>
      </div>

      {/* --- 1. PRIMARY CATEGORIES (Dynamic Render) --- */}
      {CATEGORY_DATA.map((cat) => (
        <div className="mb-4 border-bottom pb-3" key={cat.id}>
          <div
            className="d-flex justify-content-between align-items-center cursor-pointer mb-2"
            onClick={() => toggleSection(cat.id)}
            style={{ cursor: "pointer" }}
          >
            <h6 className="small fw-bold text-uppercase text-dark mb-0 d-flex align-items-center gap-2">
              <cat.icon size={16} className="text-muted" /> {cat.title}
            </h6>
            {openSections[cat.id] ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </div>

          {openSections[cat.id] && (
            <div className="animate__animated animate__fadeIn ms-1">
              {cat.subcategories.map((sub, idx) => (
                <div key={idx} className="mb-2">
                  <span className="text-muted x-small fw-bold d-block mb-1">
                    {sub.name}
                  </span>
                  {sub.types.slice(0, 5).map((type) => (
                    <div className="form-check my-1" key={type}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`${cat.id}-${type}`}
                      />
                      <label
                        className="form-check-label small text-secondary"
                        htmlFor={`${cat.id}-${type}`}
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* --- 2. TECHNICAL FILTERS (Dynamic Render) --- */}
      {TECHNICAL_FILTERS.map((filter, index) => (
        <div className="mb-4" key={index}>
          <div
            className="d-flex justify-content-between align-items-center cursor-pointer mb-2"
            onClick={() => toggleSection(filter.title)}
            style={{ cursor: "pointer" }}
          >
            <h6 className="small fw-bold text-uppercase text-dark mb-0 d-flex align-items-center gap-2">
              <filter.icon size={16} className="text-muted" /> {filter.title}
            </h6>
            {openSections[filter.title] ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </div>

          {openSections[filter.title] && (
            <div className="animate__animated animate__fadeIn ms-1">
              <div className="d-flex flex-wrap gap-2">
                {filter.options.map((option) => (
                  <div className="form-check w-100" key={option}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={option}
                    />
                    <label
                      className="form-check-label small text-secondary"
                      htmlFor={option}
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Price Range Section */}
      <div className="mb-4">
        <h6 className="small fw-bold text-uppercase text-muted mb-3">
          Price Range
        </h6>

        {/* Container for the range and the tooltip */}
        <div className="position-relative pt-4">
          {/* Dynamic Tooltip Pointer */}
          <div
            className="position-absolute badge bg-primary"
            style={{
              left: `calc(${getPlacement()}% + (${
                8 - getPlacement() * 0.15
              }px))`,
              top: "-5px",
              transform: "translateX(-50%)",
              fontSize: "0.75rem",
            }}
          >
            ₹{price}
          </div>
          <input
            type="range"
            className="form-range"
            min={min}
            max={max}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-between small text-muted">
          <span>₹{min}</span>
          <span>₹{max}+</span>
        </div>
      </div>

      {/* Rating Section */}
      {/* <div>
        <h6 className="small fw-bold text-uppercase text-muted mb-3">Rating</h6>
        {[5, 4, 3].map((star) => (
          <div className="d-flex align-items-center gap-2 mb-2" key={star}>
            <input className="form-check-input" type="checkbox" />
            <div className="d-flex text-warning">
              {[...Array(star)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <span className="small text-muted">& Up</span>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Sidebar;
