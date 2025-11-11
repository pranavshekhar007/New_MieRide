import React from "react";

function NoRecordFound({ theme, marginTop }) {
  return (
    <div
      className={
        "noRecordFoundMain d-flex justify-content-center align-items-center  vh-100" +
        (theme == "light"
          ? " bg-light "
          : " bg-Dark " 
          ? " mt-0"
          : "mt-4")
      }
      style={{marginTop:marginTop}}
    >
      <div className="noRecordFoundInner ">
        <h1 className={theme == "light" ? "text-dark" : "text-light"}>
          "This page is currently empty."
        </h1>
        <p className={theme == "light" ? "text-dark" : "text-light" + " px-3"}>
          "It seems like there's no data to display here yet. As you manage and
          grow, this space will soon be filled with valuable information."
        </p>
      </div>
    </div>
  );
}

export default NoRecordFound;
