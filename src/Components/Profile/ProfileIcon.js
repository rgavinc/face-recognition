import React, { useState, Fragment } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

const ProfileIcon = ({ onRouteChange, toggleModal, user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignout = () => {
    //localhost:3000/signin
    fetch("http://localhost:3000/signout/", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: window.sessionStorage.getItem("token")
      }
    })
      .then(() => {
        console.log("in here");
        window.sessionStorage.removeItem("token");
        onRouteChange("signin");
      })
      .catch(err => console.log);
  };

  return (
    <div className="pa4 tc">
      <Dropdown
        style={{ marginRight: "30px" }}
        direction="up"
        isOpen={dropdownOpen}
        toggle={() => setDropdownOpen(!dropdownOpen)}
      >
        <DropdownToggle
          tag="span"
          data-toggle="dropdown"
          aria-expanded={dropdownOpen}
        >
          <img
            src="http://tachyons.io/img/logo.jpg"
            className="br-100 ba h3 w3 dib"
            alt="avatar"
          />
        </DropdownToggle>
        <DropdownMenu
          className="b--transparent shadow-5"
          style={{ backgroundColor: "rgba(255,255,255,0.5" }}
        >
          <DropdownItem onClick={toggleModal}>View Profile</DropdownItem>
          <DropdownItem onClick={handleSignout}>Sign Out</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default ProfileIcon;
