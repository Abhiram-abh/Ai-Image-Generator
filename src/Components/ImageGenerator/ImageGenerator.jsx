import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import default_image from '../Assets/default_image.svg';
import axios from 'axios'; // If you choose to use Axios
// If using Axios, ensure it's installed via `npm install axios`

const ImageGenerator = () => {
  const [image_url, setImage_url] = useState('/');
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    const prompt = inputRef.current.value.trim();

    if (!prompt) {
      alert('Please enter a description for the image.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'https://api.openai.com/v1/images/generations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            prompt: prompt,
            n: 1,
            size: '512x512',
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Log the full error response for debugging
        console.error('API Error:', data);
        throw new Error(data.error.message || 'Unknown error from API');
      }

      const data_array = data.data;

      // Check if data_array is not empty and contains a valid URL
      if (data_array && data_array.length > 0 && data_array[0].url) {
        setImage_url(data_array[0].url);
      } else {
        setImage_url(default_image); // Fallback to default image
        console.error('No image generated or data is invalid');
      }
    } catch (error) {
      console.error('Error generating image:', error.message);
      setImage_url(default_image); // Fallback to default image in case of an error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        Ai Image <span>Generator</span>
      </div>
      <div className="img-loading">
        <div className="image">
          <img src={image_url === '/' ? default_image : image_url} alt="Generated" />
        </div>
        <div className="loading">
          <div className={loading ? 'loading-bar-full' : 'loading-bar'}></div>
          <div className={loading ? 'loading-text' : 'display-none'}>Loading...</div>
        </div>
      </div>

      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe what you want to see"
        />
        <div className="generate-btn" onClick={generateImage}>
          Generate
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
