import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageURL, box }) => {
	return (
		<div className='center ma'>
			<div className='absolute mt2'>
				<img id='inputimage' alt=''  src={imageURL} width='auto' height='400px' />
				<div className='bounding-box' style={{top: box.topRow , left: box.leftCol , bottom: box.bottomRow , right: box.rightCol }}></div>
			</div>
		</div>
	);

}

export default FaceRecognition;