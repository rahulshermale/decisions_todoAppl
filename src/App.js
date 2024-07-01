import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './index.css';
// import TodoApp from './components/TodoApp';
import MyToDoApp from './components/MyToDoApp';


const App = () => {
  return (
    <Router>
    <div>

<MyToDoApp/>

     
      <Routes>
        <Route path="/aa" element={<MyToDoApp/>} />
       </Routes>
 
    </div>
  </Router>
   
  );
};

export default App;
