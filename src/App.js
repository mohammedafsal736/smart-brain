import React, { Component } from 'react';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';


import './App.css';
import 'tachyons';


const app = new Clarifai.App({
 apiKey: '91c61fa7ab6745089dfce30923378561'
});



const particleOption = {
            		particles: {
            			number: {
							value: 250,
							density: {
								enable: true,
								value_area:800
							}
						}
            		}
            	}

const initialState = {
		input:'',
		imageURL:'',
		box:{},
		route: 'signin',
		isSignedIn: false,
		user: {
			id:'',
			name:'',
			email:'',
			entries:0,
			password:'',
			joined:''
		}
}

class App extends Component{
	constructor(){
		super();
		this.state = initialState;
	}
	
	loadUser = (data) => {
		this.setState({user:{ 
			id: data.id,
			name: data.name,
			email: data.email,
			entries: data.entries,
			password: data.password,
			joined: data.joined
	  		}})
	}
	
	
	calculateFaceLocation =(response) =>{
		const clarifaiFaces = response.outputs[0].data.regions[0].region_info.bounding_box;
		console.log(clarifaiFaces);
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number(image.height);
		console.log(width,height);
		return {
			topRow: clarifaiFaces.top_row * height,
			leftCol: clarifaiFaces.left_col * width,
			bottomRow: height - (clarifaiFaces.bottom_row * height),
			rightCol: width - (clarifaiFaces.right_col * width)
			
		}
	}
	
	displayFaceBox = (box) => {
		this.setState({box: box});
	}
	
	onInputChange=(event)=>{
		this.setState({input: event.target.value});
	}
	
	onRouteChange = (route) =>{
		if(route === 'signout'){
			this.setState(initialState);
		} else if(route === 'home'){
			this.setState({isSignedIn: true});
		}
		this.setState({route: route});
	}
	
	onButtonSubmit = () =>{
		this.setState({imageURL: this.state.input})
			app.models.predict(
				Clarifai.FACE_DETECT_MODEL, this.state.input)
				.then(response =>  {
				if(response){
					fetch('http://localhost:3000/image', {
					method: 'put',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({
						id: this.state.user.id
					})
					}).then(response => response.json())
					.then(count => {
						this.setState(Object.assign(this.state.user, { entries: count }))
					}).catch(console.log);
				}
				this.displayFaceBox(this.calculateFaceLocation(response))
				 }).catch(err => console.log(err));
	}
	
  render(){
	  const {isSignedIn, imageURL, route, box} = this.state;
	  return (
    <div className="App">
	   <Particles className='particle'
        params={particleOption}/>    
		<Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
		{ route === 'home'
		 ?  <div>
			  <Logo />
			  <Rank name={this.state.user.name} entries={this.state.user.entries}/>
			  <ImageLinkForm 
			  onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
			  <FaceRecognition box={box} imageURL={imageURL}/>
			</div>
		 :(route === 'signin'
	  		? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
		  	: <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
	  	  )
	  	}
    </div>
  );
  }
	
	
}

export default App;
