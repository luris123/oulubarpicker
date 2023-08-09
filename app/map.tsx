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
  const [moreBars, setMoreBars] = useState<Bar[]>([]);
  const [evenMoreBars, setEvenMoreBars] = useState<Bar[]>([]);
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=65.01150495824623,25.467207074816663&radius=3000&type=bar&key=${apikey}`;
  const proxyurl = "https://cors-anywhere.herokuapp.com/";

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apikey!,
  });

  const center = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [latitude, longitude]
  );

  const allBars = [...bars, ...moreBars, ...evenMoreBars];

  useEffect(() => {
    const getBars = async () => {
      try {
        let response = await axios.get(proxyurl + url);
        console.log(response.data);
        setBars(response.data.results);
        if ("next_page_token" in response.data) {
          //wait for 5 seoconds
          await new Promise((resolve) => setTimeout(resolve, 5000));
          let next_page_token = response.data.next_page_token;
          let response2 = await axios.get(
            proxyurl +
              `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=65.01150495824623,25.467207074816663&radius=3000&type=bar&key=${apikey}&pagetoken=${next_page_token}`
          );
          console.log(response2.data);
          setMoreBars(response2.data.results);

          if ("next_page_token" in response2.data) {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            let next_page_token = response2.data.next_page_token;
            let response3 = await axios.get(
              proxyurl +
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=65.01150495824623,25.467207074816663&radius=3000&type=bar&key=${apikey}&pagetoken=${next_page_token}`
            );
            console.log(response3.data);
            setEvenMoreBars(response3.data.results);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    getBars();
  }, [apikey, url]);

  const showCenter = () => {
    setLatitude(65.01150495824623);
    setLongitude(25.467207074816663);
    setZoom(13);
  };

  const randomBar = () => {
    const random = Math.floor(Math.random() * allBars.length);
    setLatitude(allBars[random].geometry.location.lat);
    setLongitude(allBars[random].geometry.location.lng);
    setZoom(18);
    console.log(allBars);
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
