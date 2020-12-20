import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
    width: '400px',
    height: '675px'
  };
  
  const center = {
    lat: 21.4272,
    lng: 92.0058
  };
const Map = () => {
    return (
        <LoadScript
        googleMapsApiKey=""
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        >
          
          <></>
        </GoogleMap>
      </LoadScript>
    );
};

export default Map;