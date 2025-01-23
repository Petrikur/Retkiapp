import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export const showToast = (message: string, isSuccess: boolean) => {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: isSuccess ? "green" : "red",
    stopOnFocus: true,
  }).showToast();
};

const Toast = () => {
  return null; // This component does not need to render anything
};

export default Toast;
