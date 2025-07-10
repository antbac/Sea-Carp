import { Button } from "react-bootstrap";
import { isLoggedIn } from "../../utils/Helpers";

function IntroBlock() {
  return (
    <>
      <div className="intro text-center">
        <h1>Welcome to Sea Carp</h1>
        <p>
          Your ultimate destination for premium fishing gear and accessories.
        </p>
      </div>
      <div className="hero text-center bg-primary text-white py-5">
        <h2>Catch the Best Deals on Fishing Gear!</h2>
        <p className="text-white">
          Rods, reels, bait, and everything you need for your next fishing
          adventure.
        </p>

        {!isLoggedIn() ? (
          <Button variant="light" as="a" href="login">
            Log in to get started
          </Button>
        ) : (
          <Button variant="light" as="a" href="products">
            Shop Now
          </Button>
        )}
      </div>
    </>
  );
}

export default IntroBlock;
