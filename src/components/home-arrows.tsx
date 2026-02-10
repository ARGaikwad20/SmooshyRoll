import { left_arrow, right_arrow } from "@assets";

const HomeArrowSection = () => {
  return (
    <div className="flex gap-x-2 justify-end">
      <img
        src={left_arrow}
        alt="left_arrow"
        className="w-16 h-16 cursor-pointer"
      />
      <img
        src={right_arrow}
        alt="right_arrow"
        className="w-16 h-16 cursor-pointer"
      />
    </div>
  );
};

export default HomeArrowSection;
