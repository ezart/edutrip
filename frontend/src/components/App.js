import React from "react";
import ReactDOM from "react-dom";

import {Container} from './Components';




const App = () => (
   <Container />
);
const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;



