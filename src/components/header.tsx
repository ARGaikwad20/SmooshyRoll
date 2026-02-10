import { logo } from "@assets";

const Header = () => {
  return (
    <div className="flex w-full h-20">
      <a href="/" className="inline-block">
        <img src={logo} alt="brand_logo" className="h-full w-auto" />
      </a>
    </div>
  );
};

export default Header;
