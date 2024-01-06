import "./style.css";
import Swal from "sweetalert2";
import { createMainContainer } from "./Components.js";
import { DOMController } from "./Controllers.js";

document.body.appendChild(createMainContainer());
DOMController.initGameSetup();
// DOMController.initGameOver();