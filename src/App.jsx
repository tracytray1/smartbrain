import { useState } from 'react'
import ParticlesBg from 'particles-bg'
import Signin from './components/Signin/Signin.jsx'
import Register from './components/Register/Register.jsx'
import Navigation from './components/Navigation/Navigation.jsx'
import FaceRecognition from './components/FaceRecognition/FaceRecognition.jsx'
import Logo from './components/Logo/Logo.jsx'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.jsx'
import Rank from './components/Rank/Rank.jsx'
import './App.css'

// const app = new Clarifai.App({
//  apikey:'62f35a186241480a8991a1b8bc5bd3be'
//});


function App() {
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [box, setBox] = useState({});
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState ({
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
})

  const loadUser = (data) => {
    setUser({
    id: data.id,
    name: data.name,
    email: data.email,
    entries: data.entries,
    joined: data.joined
  })
}

  const onInputChange = (event) => {
    setInput(event.target.value);
  }


  const calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    };
  };

  const displayFaceBox = (box) => {
    setBox(box);
  }


  const onButtonSubmit = () => {
    setImageUrl(input);
    fetch('https://smartbrain-backend-n3j8.onrender.com/imageurl', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://smartbrain-backend-n3j8.onrender.com/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: user.id
            })
          })
            .then(res => res.json())
            .then(count => {
              setUser(prevUser => ({
                ...prevUser,
                entries: count[0].entries
              }));
            })
            .catch(err => console.error("Error when updating the entries :", err));
        }
        displayFaceBox(calculateFaceLocation(response));
      })
      .catch(error => console.error("Clarifai error :", error));
  };

  const onRouteChange = (route) => {
    if (route === 'signout') {
      setIsSignedIn(false);
      setInput('');
      setImageUrl('');
      setBox({});
      setUser({
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
      })
    } else if (route === 'home') {
      setIsSignedIn(true)
    }
    setRoute(route)
  }


  return (
    <div className="App">
      <ParticlesBg type="cobweb" color="#ffffff" bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      { route === "home"
      ? <div>
        <Logo />
        <Rank name={user.name} entries={user.entries} />
        <ImageLinkForm
          onInputChange={onInputChange}
          onButtonSubmit={onButtonSubmit} />
        <FaceRecognition imageUrl={imageUrl} box={box}/>
      </div>
      : (
        route === "signin"
        ? <Signin loadUser={loadUser} onRouteChange={onRouteChange} />
        : <Register loadUser = {loadUser} onRouteChange={onRouteChange} />
        )
      }
    </div>
  );
}

export default App
