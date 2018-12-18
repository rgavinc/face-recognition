import React, { Component } from "react";
import Navigation from "./Components/Navigation/Navigation";
import Logo from "./Components/Logo/Logo";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import Signin from "./Components/Signin/Signin";
import Rank from "./Components/Rank/Rank";
import "./App.css";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";
import Register from "./Components/Register/Register";

const app = new Clarifai.App({
  apiKey: "f58db3e72129494cbe9650eb2e383c5e"
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "signin",
      isSignedIn: false,
      user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: ""
      }
    };
  }

  calculateFaceLocation = data => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.querySelector("#input-image");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      left: clarifaiFace.left_col * width,
      top: clarifaiFace.top_row * height,
      right: width - clarifaiFace.right_col * width,
      bottom: height - clarifaiFace.bottom_row * height
    };
  };

  loadUser = user => {
    const { password, ...rest } = user;
    this.setState({ user: rest });
  };

  displayFaceBox = box => {
    this.setState({ box });
  };

  onInputChange = event => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => {
        if (response) {
          fetch("http://localhost:3000/image", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(entries => {
              this.setState({
                user: { ...this.state.user, entries }
              });
            });
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(err => console.log({ err }));
  };

  onRouteChange = route => {
    let isSignedIn = false;
    if (route === "home") isSignedIn = true;
    this.setState({ route, isSignedIn });
  };

  render() {
    const { imageUrl, route, isSignedIn, user } = this.state;
    const particleOptions = {
      particles: {
        number: {
          value: 100,
          density: {
            enable: true,
            value_area: 800
          }
        }
      }
    };
    return (
      <div className="App">
        <Particles className="particles" params={particleOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "signin" && (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )}
        {route === "register" && (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
        {route === "home" && (
          <React.Fragment>
            <Logo />
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={this.state.box} imageUrl={imageUrl} />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default App;
