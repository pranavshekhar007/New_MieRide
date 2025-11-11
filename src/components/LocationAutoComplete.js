import React, { useState, useEffect } from "react";

const LocationAutoComplete = ({
  placeholder,
  callBackFunc,
  clearInput,
  isGeoDeal,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const GOOGLE_MAPS_API_KEY = "AIzaSyD6KJOHKQLUWMAh9Yl5NQrEAI9bxrvYCqQ";

  // Load the Google Maps script dynamically
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const existingScript = document.getElementById("google-maps-script");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.onload = () =>
          console.log("Google Maps API loaded successfully");
        document.body.appendChild(script);
      }
    };

    loadGoogleMapsScript();
  }, []);
  useEffect(() => {
    if (clearInput) {
      setInputValue("");
    }
  }, [clearInput]);
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim().length > 1 && window.google) {
      const autocompleteService =
        new window.google.maps.places.AutocompleteService();

      autocompleteService.getPlacePredictions(
        { input: value, types: ["geocode"] }, // You can modify the types here
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setSuggestions(predictions || []);
          } else {
            setSuggestions([]);
          }
        }
      );
    } else {
      setSuggestions([]);
    }
    if (value.trim().length == 0) {
      setSuggestions([]);
    }
  };
  const handleSuggestionClick = (placeId) => {
    if (window.google) {
      const placesService = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );

      placesService.getDetails({ placeId }, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const { lat, lng } = place.geometry.location;

          let obj = { lat: lat(), lng: lng() };
          // Extract city name from address components
          let cityName = "";
          let location=place?.formatted_address;

          for (let i = 0; i < place.address_components.length; i++) {
            const component = place.address_components[i];
            // this line is added for taking the long name with sublocality , if we don't need to have sublocality then remove this line
            if (component.types.includes("sublocality")) {
              cityName = component.long_name;
              obj.cityName = cityName;
              break;
            }
            // ----------------------------------------------------
            if (component.types.includes("locality")) {
              cityName = component.long_name;
              obj.cityName = cityName;
              break;
            }
            if (component.types.includes("political")) {
              cityName = component.long_name;
              obj.cityName = cityName;
              break;
            }
          }
          
          let provienceArray = place?.address_components?.filter((v, i) => {
            return v?.types?.includes("administrative_area_level_1");
          });
          let provienceName = provienceArray[0].long_name;
          callBackFunc({ ...obj, provienceName, location });
          setInputValue(place.formatted_address || place.name || "");
          setSuggestions([]);
        } else {
          console.error("Failed to fetch place details:", status);
        }
      });
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        style={{
          width: "100%",
          padding: isGeoDeal ? "6px" : "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: isGeoDeal ? "10px" : "4px",
        }}
      />
      {!isGeoDeal && (
        <img
          src={"https://cdn-icons-png.flaticon.com/128/751/751463.png"}
          style={{
            height: "18px",
            position: "relative",
            left: "-30px",
            top: "-2px",
          }}
        />
      )}

      <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
        {suggestions.map((suggestion) => (
          <li
            key={suggestion.place_id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #ddd",
              cursor: "pointer",
              fontSize: "14px",
            }}
            className=""
            onClick={() => handleSuggestionClick(suggestion.place_id)}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/535/535188.png"
              style={{ height: "14px", opacity: "0.5", marginRight: "10px" }}
            />{" "}
            {suggestion?.description.length < 35
              ? suggestion.description
              : suggestion.description.substring(0, 32) + "..."}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationAutoComplete;
