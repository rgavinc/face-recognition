import React, { Component } from 'react';
import Navigation from "./Components/Navigation/Navigation"
import Logo from "./Components/Logo/Logo"
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import Rank from "./Components/Rank/Rank";
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from "clarifai";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition"

const app = new Clarifai.App({
  apiKey: 'f58db3e72129494cbe9650eb2e383c5e'
});


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {}
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.querySelector("#input-image");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      left: clarifaiFace.left_col * width,
      top: clarifaiFace.top_row * height,
      right: width - (clarifaiFace.right_col * width),
      bottom: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => this.displayFaceBox(
        this.calculateFaceLocation(response)
      ))
      .catch(err => console.log({ err }));
  }

  render() {
    const { imageUrl } = this.state;
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
      <div >
        <Particles className="particles"
          params={particleOptions}
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
        <FaceRecognition box={this.state.box} imageUrl={imageUrl} />
      </div>
    );
  }
}

export default App;
