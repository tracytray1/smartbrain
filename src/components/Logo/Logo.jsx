import React from 'react' ;
import Tilt from 'react-parallax-tilt';
import './Logo.css'
import brain from './brain.png'


const Logo = () => {
  return (
    <div className="ma4 mt0">
      <Tilt className='Tilt br2 shadow-2' options={{ max: 60 }} style={{ height: '100px', width: '100px'}} >
        <div className='Tilt-inner pa3'><img src={brain} style={{ paddingTop: '5px' }} alt="logo smartbrain" /></div>
      </Tilt>
    </div>
  );
}

export default Logo;
