import React, { useState, useEffect } from "react";
import Particles from "react-particles-js";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import Modal from "./components/Modal/Modal";
import Profile from "./components/Profile/Profile";
import Loader from "react-loader-spinner";
import "./App.css";

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "loading",
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: "",
    name: "",
    pet: "",
    age: "",
    email: "",
    entries: 0,
    joined: ""
  }
};

const App = () => {
  const [
    { input, imageUrl, box, route, isSignedIn, isProfileOpen, user },
    setState
  ] = useState(initialState);

  useEffect(() => {
    const token = window.sessionStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/signin", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      })
        .then(resp => resp.json())
        .then(data => {
          if (data && data.id) {
            fetch(`http://localhost:3000/profile/${data.id}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: token
              }
            })
              .then(resp => resp.json())
              .then(user => {
                if (user && user.email) {
                  loadUser(user);
                  onRouteChange("home");
                }
              })
              .catch(err => {
                throw Error("fail");
              });
          } else throw Error("no data");
        })
        .catch(err => {
          console.log("something bad happened", err);
          onRouteChange("signin");
        });
    } else onRouteChange("signin");
  }, []);

  const loadUser = data => {
    setState(prevState => ({
      ...prevState,
      user: data
    }));
  };

  const calculateFaceLocation = data => {
    if (data && data.outputs) {
      const clarifaiFace =
        data.outputs[0].data.regions[0].region_info.bounding_box;
      const regions = data.outputs[0].data.regions;
      const image = document.getElementById("inputimage");
      const width = Number(image.width);
      const height = Number(image.height);
      return regions.map(({ region_info: { bounding_box } }) => ({
        left: bounding_box.left_col * width,
        top: bounding_box.top_row * height,
        right: width - bounding_box.right_col * width,
        bottom: height - bounding_box.bottom_row * height
      }));
    }
    return;
  };

  const displayFaceBoxes = box => {
    if (box) setState(prevState => ({ ...prevState, box }));
  };

  const onInputChange = e => {
    setState(prevState => ({ ...prevState, input: e.target.value }));
  };

  const onButtonSubmit = () => {
    setState(prevState => ({ ...prevState, imageUrl: input }));
    fetch("http://localhost:3000/imageurl", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: window.sessionStorage.getItem("token")
      },
      body: JSON.stringify({ input })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch("http://localhost:3000/image", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: window.sessionStorage.getItem("token")
            },
            body: JSON.stringify({
              id: user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              setState(prevState => ({
                ...prevState,
                user: { ...user, entries: count }
              }));
            })
            .catch(console.log);
        }
        displayFaceBoxes(calculateFaceLocation(response));
      })
      .catch(console.log);
  };

  const onRouteChange = route => {
    if (route === "signout") return setState(initialState);
    else if (route === "home") {
      setState(prevState => ({ ...prevState, isSignedIn: true }));
    }
    setState(prevState => ({ ...prevState, route: route }));
  };

  const toggleModal = () => {
    setState(prevState => ({
      ...prevState,
      isProfileOpen: !isProfileOpen
    }));
  };

  return (
    <div className="App">
      <Particles className="particles" params={particlesOptions} />
      <Navigation {...{ isSignedIn, user, onRouteChange, toggleModal }} />
      {isProfileOpen && (
        <Modal>
          <Profile {...{ isProfileOpen, user, loadUser, toggleModal }}>
            hello
          </Profile>
        </Modal>
      )}
      {route === "home" && (
        <div>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm {...{ onInputChange, onButtonSubmit }} />
          <FaceRecognition {...{ imageUrl, box }} />
        </div>
      )}
      {route === "signin" && <Signin {...{ loadUser, onRouteChange }} />}
      {route === "register" && <Register {...{ loadUser, onRouteChange }} />}
      {route === "loading" && (
        <Loader
          type="Puff"
          color="#00BFFF"
          height={100}
          width={100}
          timeout={3000} //3 secs
        />
      )}
    </div>
  );
};

export default App;
