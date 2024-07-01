import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5201', // Change the URL according to your API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;


// http://localhost:5201/api/ToDo