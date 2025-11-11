import React, { useState } from "react";

function CustomPagination({
  current_page,
  last_page,
  per_page,
  onPageChange,
  onPerPageChange,
}) {
  const [goToPage, setGoToPage] = useState("");

  const generatePageNumbers = () => {
    const pages = [];
    const delta = 1;

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

  const handleGoClick = () => {
    const page = parseInt(goToPage);
    if (page >= 1 && page <= last_page) {
      onPageChange(page);
      setGoToPage("");
    }
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <div className="paginationMainModern d-flex align-items-center">
        <span className="paginationText">Showing</span>
        <select
          className="paginationSelect"
          value={per_page}
          onChange={(e) => onPerPageChange(e?.target?.value)}
        >
          {[10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        {/* Prev */}
        <button
          className="paginationBtn"
          onClick={() => onPageChange(current_page - 1)}
          disabled={parseInt(current_page) === 1}
        >
          &lt;
        </button>

        {/* Page Numbers */}
        {generatePageNumbers().map((page, i) =>
          page === "..." ? (
            <span key={i} className="paginationDots">
              ..
            </span>
          ) : (
            <button
              key={page}
              className={`paginationBtn ${
                parseInt(current_page) === page ? "activePage" : ""
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          className="paginationBtn"
          onClick={() => onPageChange(parseInt(current_page) + 1)}
          disabled={parseInt(current_page) === parseInt(last_page)}
        >
          &gt;
        </button>

        {/* Go to Page */}
        <input
          type="number"
          className="paginationGoInput"
          placeholder=""
          value={goToPage}
          onChange={(e) => setGoToPage(e.target.value)}
        />
        <button className="paginationGoBtn" onClick={handleGoClick}>
          Go &gt;
        </button>
      </div>
    </div>
  );
}

export default CustomPagination;
