import type { DayData } from "@models";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DayScheduleCard = ({ dayData }: { dayData: DayData[] }) => {
  const derivedIndex =
    dayData.findIndex((day) => day.isActive) >= 0
      ? dayData.findIndex((day) => day.isActive)
      : 0;

  const [userIndex, setUserIndex] = useState<number | null>(null);
  const activeIndex = userIndex ?? derivedIndex;

  const today = new Date();
  const todayFormatted = `${today.getMonth() + 1}/${today.getDate()}`;

  const handleDayClick = (index: number) => {
    setUserIndex(index);
  };

  const navigate = useNavigate();
  const handleEpisodeClick = (id: string) => {
    navigate(`/show/${id}`);
  };

  return (
    <>
      {dayData.map((day, index) => (
        <div
          key={index}
          className={`${
            activeIndex == index ? "bg-[#1E1E1E]/25 w-full" : "bg-[#1E1E1E]/60"
          } border-[0.5px] border-[#FFBD1E] w-[80%] text-center flex flex-col gap-y-4 p-2 rounded-3xl`}
          onClick={() => handleDayClick(index)}
        >
          <div className="flex flex-col gap-y-0 cursor-pointer">
            {activeIndex === index && day.date === todayFormatted ? (
              <p className="my-3">TODAY</p>
            ) : (
              <>
                <p>{day.date}</p>
                <p>{day.name}</p>
              </>
            )}
          </div>

          {day.dayEpisodesData.map((episode, innerIndex) => (
            <div
              key={innerIndex}
              className={`border-[0.5px] border-[#FFBD1E] w-full flex flex-col gap-y-2 p-2 rounded-xl items-start border-dashed cursor-pointer`}
              onClick={() => handleEpisodeClick(episode.showId)}
            >
              <p className="text-[#757575] text-[12px]">{episode.time}</p>
              <p className="text-[14px] text-left">{episode.showName}</p>
              <p className="text-[#757575] text-[12px]">
                Episode {episode.episodeNumber}
              </p>

              {activeIndex == index ? (
                <img
                  src={episode.image}
                  alt="poster"
                  className="rounded-xl p-2"
                />
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default DayScheduleCard;
