import React, { useState } from "react";
import "./Profile.css";

const Profile = ({ isProfileOpen, toggleModal, loadUser, user = {} }) => {
  const dateJoined = new Date(user.joined);
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);
  const [pet, setPet] = useState(user.pet);
  const onFormChange = e => {
    switch (e.target.name) {
      case "user-name":
        setName(e.target.value);
        break;
      case "user-age":
        setAge(e.target.value);
        break;
      case "user-pet":
        setPet(e.target.value);
        break;
      default:
        return;
    }
  };

  const onProfileUpdate = data => {
    fetch(`http://localhost:3000/profile/${user.id}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: window.sessionStorage.getItem("token")
      },
      body: JSON.stringify({ formData: data })
    })
      .then(resp => {
        if (resp.ok) {
          toggleModal();
          loadUser({ ...user, ...data });
        }
      })
      .catch(e => console.log("error", e));
  };

  return (
    <div className="profile-modal">
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
        <main className="pa4 black-80 w-80">
          <img
            src="http://tachyons.io/img/logo.jpg"
            className="h3 w3 dib"
            alt="avatar"
          />
          <h1>{name || " "}</h1>
          <h4>Images Submitted: {user.entries}</h4>
          <p>
            Member since
            {` ${dateJoined.getMonth()}/${dateJoined.getDate()}/${dateJoined.getFullYear()}`}
          </p>
          <hr />
          <div className="mt3">
            <label className="mt2 fw6" htmlFor="user-name">
              Name:
            </label>
            <input
              className="pa2 ba w-100"
              value={name}
              type="text"
              name="user-name"
              id="name"
              onChange={onFormChange}
            />
            <label className="mt2 fw6" htmlFor="user-age">
              Age:
            </label>
            <input
              className="pa2 ba w-100"
              value={age}
              type="text"
              name="user-age"
              id="age"
              onChange={onFormChange}
            />
            <label className="mt2 fw6" htmlFor="pet-name">
              Pet:
            </label>
            <input
              className="pa2 ba w-100"
              value={pet}
              type="text"
              name="user-pet"
              id="pet"
              onChange={onFormChange}
            />
            <div
              className="mt4"
              style={{ display: "flex", justifyContent: "space-evenly" }}
            >
              <button
                onClick={() => onProfileUpdate({ name, age, pet })}
                className="b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20"
              >
                Save
              </button>
              <button
                onClick={toggleModal}
                className="b pa2 grow pointer hover-white w-40 bg-light-red b--black-20"
              >
                Cancel
              </button>
            </div>
          </div>
        </main>
        <div className="modal-close" onClick={toggleModal}>
          &times;
        </div>
      </article>
    </div>
  );
};

export default Profile;
