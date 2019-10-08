import React, { Component } from "react";
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

// TODO: add pet and age functionality
// TODO: delete token after signout
// TODO: add roouting
// TODO: add auth to reegister
// TODO: clean up code

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    console.log("in compoonent did moount");
    const token = window.sessionStorage.getItem("token");
    if (token) {
      console.log("I have a token");
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
                  this.loadUser(user);
                  this.onRouteChange("home");
                }
              })
              .catch(err => {
                console.log("bad");
                throw Error("fail");
              });
          } else {
            console.log();
            throw Error("no data");
          }
        })
        .catch(err => {
          console.log("something bad happened", err);
          this.onRouteChange("signin");
        });
    } else {
      this.onRouteChange("signin");
    }
  }

  loadUser = data => {
    this.setState({
      user: data
    });
  };

  calculateFaceLocation = data => {
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

  displayFaceBoxes = boxes => {
    if (boxes) this.setState({ boxes });
  };

  onInputChange = event => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch("http://localhost:3000/imageurl", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: window.sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        input: this.state.input
      })
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
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log);
        }
        this.displayFaceBoxes(this.calculateFaceLocation(response));
      })
      .catch(err => console.log(err));
  };

  onRouteChange = route => {
    if (route === "signout") {
      return this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  toggleModal = () => {
    console.log("calling toggle modal");
    this.setState(state => ({
      isProfileOpen: !state.isProfileOpen
    }));
  };

  render() {
    const {
      isSignedIn,
      imageUrl,
      route,
      boxes,
      isProfileOpen,
      user
    } = this.state;
    console.log({ isProfileOpen });
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          {...{ isSignedIn, user }}
          onRouteChange={this.onRouteChange}
          toggleModal={this.toggleModal}
        />
        {isProfileOpen && (
          <Modal>
            <Profile
              {...{ isProfileOpen, user }}
              loadUser={this.loadUser}
              toggleModal={this.toggleModal}
            >
              hello
            </Profile>
          </Modal>
        )}
        {route === "home" && (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
          </div>
        )}
        {route === "signin" && (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )}
        {route === "register" && (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
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
  }
}

export default App;
