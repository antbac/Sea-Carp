import { useEffect } from "react";
import { isLoggedIn, LogOut } from "../../utils/Helpers";

function Logout() {
  useEffect(() => {
    if (isLoggedIn()) {
      try {
        LogOut();
        document.location.href = "/";
      } catch (error) {
        console.error("An error occurred while trying to log out.", error);
      }
    }
  });

  return <></>;
}

export default Logout;
