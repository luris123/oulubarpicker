"use client";

import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

interface Bar {
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export default function Map() {
  const apikey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const city = "Oulu"; // place id: ChIJwYUhwKgygEYRfekSKzItsIs
  const [latitude, setLatitude] = useState(65.01150495824623);
  const [longitude, setLongitude] = useState(25.467207074816663);
  const [zoom, setZoom] = useState(13);
  const [bars, setBars] = useState<Bar[]>([]);
  const [results, setResults] = useState<google.maps.places.PlaceResult[]>([]);
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=65.01150495824623,25.467207074816663&radius=3000&type=bar&key=${apikey}`;
  const proxyurl = "https://cors-anywhere.herokuapp.com/";

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apikey!,
  });

  const center = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [latitude, longitude]
  );

  useEffect(() => {
    const getBars = async () => {
      try {
        const response = await axios.get(proxyurl + url);
        console.log(response.data);
        setBars(response.data.results);
      } catch (error) {
        console.log(error);
      }
    };

    getBars();
  }, [url]);

  const showCenter = () => {
    setLatitude(65.01150495824623);
    setLongitude(25.467207074816663);
    setZoom(13);
  };

  const randomBar = () => {
    const random = Math.floor(Math.random() * bars.length);
    setLatitude(bars[random].geometry.location.lat);
    setLongitude(bars[random].geometry.location.lng);    
    setZoom(18);
  };

  if (!isLoaded) return <div>Loading... and sniping</div>;

  return (
    <>
      <GoogleMap
        zoom={zoom}
        center={center}
        mapContainerClassName="map-container"
      ></GoogleMap>

      <button onClick={showCenter}>Center</button>
      <button onClick={randomBar}>Random</button>
    </>
  );
}
