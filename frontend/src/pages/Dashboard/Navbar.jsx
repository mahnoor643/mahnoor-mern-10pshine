import React from 'react'

const Navbar = () => {
  return (
     <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                <div className="container-fluid">
                    <h1 className="navbar-brand d-flex justify-content-center align-items-center m-0 ms-2 text-green fw-bold"><img src="/Images/Logo.png" className='logo' alt="" /> <span className="display-6 fw-bold">Note</span>Verse</h1>
                    {/* <form className="d-none d-md-flex ms-3 flex-grow-1" role="search">
                        <input id="globalSearch" className="form-control me-2" placeholder="Search notes or tags..." />
                    </form> */}
                   <div className="d-flex align-items-center gap-2">
  {/* Offcanvas Menu Button (Mobile Only) */}
  <button
    className="btn btn-outline-secondary d-md-none"
    data-bs-toggle="offcanvas"
    data-bs-target="#offcanvasSidebar"
  >
    Menu
  </button>

  {/* User Dropdown */}
  <div className="dropdown">
    <button
      className="d-flex align-items-center border-0 bg-transparent"
      id="userDropdown"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      {/* ✅ Conditional rendering for avatar */}
      {/* {user?.profileImage ? (
        <img
          src={user.profileImage}
          alt="User"
          className="rounded-circle me-2"
          style={{
            width: "40px",
            height: "40px",
            objectFit: "cover",
          }}
        />
      ) : ( */}
        <div
          className="rounded-circle bg-green text-white d-flex align-items-center justify-content-center me-2"
          style={{
            width: "40px",
            height: "40px",
            fontWeight: "600",
            fontSize: "1.1rem",
          }}
        >
          {/* {user?.username?.charAt(0).toUpperCase() || "?"} */}M
        </div>
      {/* )} */}

      <span className="fw-semibold me-1 text-grey">
        {/* {user?.username || "User"} */}Mahnoor Tariq
      </span>
      <i className="bi bi-chevron-down"></i>
    </button>

    <ul
      className="dropdown-menu dropdown-menu-end shadow-sm"
      aria-labelledby="userDropdown"
    >
      <li>
        <a className="dropdown-item" href="#">
          Profile
        </a>
      </li>
      <li>
        <hr className="dropdown-divider" />
      </li>
      <li>
        <a className="dropdown-item text-danger" href="#">
          Logout
        </a>
      </li>
    </ul>
  </div>
</div>

                </div>
            </nav>
  )
}

export default Navbar