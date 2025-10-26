import React from "react";

export default function AdminNavbar({Toggle}) {
  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-dark bg-transparent px-3">
        <a className="navbar-brand" href="#" onClick={Toggle}>
          <span className="material-symbols-outlined">menu</span>
        </a>
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavId"
          aria-expanded="false"
          aria-label="Toggle navigation"
        ></button>
        <div className="collapse navbar-collapse" id="collapsibleNavId">
          
          <ul className="navbar-nav me-auto mt-2 mt-lg-0">
            <li className="nav-item">
              <a className="nav-link active" href="#" aria-current="page">
                Home <span className="visual"></span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Link
              </a>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="dropdownId"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Admin-Nk
              </a>

              <div className="dropdown-menu" aria-labelledby="dropdownId">
                <a className="dropdown-item" href="#">
                  Profile 
                </a>
                <a className="dropdown-item" href="#">
                  Setting
                </a>
                <a className="dropdown-item" href="#">
                  Logout
                </a>
              </div>

            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
