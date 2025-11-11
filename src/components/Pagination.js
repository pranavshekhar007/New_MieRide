import React from "react";

function Pagination({
  current_page,
  last_page,
  per_page,
  onPageChange,
  onPerPageChange,
}) {
  console.log(current_page,
  last_page,
  per_page,
 )
  const generatePageNumbers = () => {
    const pages = [];
    const delta = 2; // how many pages before and after current

    for (let i = 1; i <= last_page; i++) {
      if (
        i === 1 ||
        i === last_page ||
        (i >= current_page - delta && i <= current_page + delta)
      ) {
        pages.push(i);
      } else if (
        i === current_page - delta - 1 ||
        i === current_page + delta + 1
      ) {
        pages.push("...");
      }
    }

    return [...new Set(pages)];
  };

  return (
    <div className="paginationMain mt-4 d-flex justify-content-center">
      <div className="d-flex align-items-center gap-2">
        <span style={{ fontSize: "12px" }}>Show</span>
        <select
          value={per_page}
          onChange={(e) => onPerPageChange(e?.target?.value)}
          style={{ height: "28px", borderRadius: "4px" }}
        >
          {[ 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        {/* Prev */}
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          style={{
            height: "28px",
            width: "28px",
            borderRadius: "4px",
            background: "#D6D6D6",
            border: "none",
          }}
        >
          <img src="/icons/singleBackword.png" alt="Prev" />
        </button>

        {/* Page Numbers */}
        {generatePageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={index} style={{ fontSize: "12px" }}>
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              style={{
                height: "28px",
                width: "28px",
                borderRadius: "4px",
                background: page === current_page ? "#353535" : "#D6D6D6",
                color: page === current_page ? "#fff" : "#000",
                border: "none",
                fontSize: "12px",
              }}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === last_page}
          style={{
            height: "28px",
            width: "28px",
            borderRadius: "4px",
            background: "#D6D6D6",
            border: "none",
          }}
        >
          <img src="/icons/singleForword.png" alt="Next" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
