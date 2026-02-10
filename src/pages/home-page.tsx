import { DayScheduleCard, Footer, Header } from "@components";
import type { DayData, DayEpisodeData } from "@models";
import { useState, useRef, useEffect } from "react";

const HomePage = () => {
  const [filteredDayData, setFilteredDayData] = useState<DayData[]>([]);

  const getWeekDates = () => {
    const today = new Date();
    const day = today.getDay();

    // Convert Sunday (0) to 7 for easier math
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      dates.push(d.toISOString().split("T")[0]); // YYYY-MM-DD
    }

    return dates;
  };

  const fetchData = async () => {
    try {
      const weekDates = getWeekDates();
      const requests = weekDates.map((date) =>
        fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/schedule/web?date=${date}&country=US`
        ).then((res) => {
          if (!res.ok) throw new Error(`Failed for ${date}`);
          return res.json();
        })
      );

      const weekResults = await Promise.all(requests);
      const filteredTempDayData: DayData[] = [];

      for (let i = 0; i < weekResults.length; i++) {
        const tempDayData: DayData = {
          isActive: false,
          name: "",
          date: "",
          dayEpisodesData: [],
        };
        const dayRawData = weekResults[i];

        const currDateObj = new Date(dayRawData[0].airstamp);
        const todayISO = new Date().toISOString().split("T")[0];
        tempDayData.isActive = dayRawData[0].airdate === todayISO;

        const day = currDateObj.getDate();
        const month = currDateObj.getMonth() + 1;

        const dayName = currDateObj
          .toLocaleDateString("en-US", { weekday: "short" })
          .toUpperCase();

        tempDayData.date = `${month}/${day}`;
        tempDayData.name = dayName;

        const filteredDayEpisodeData: DayEpisodeData[] = [];

        for (let j = 0; j < dayRawData.length; j++) {
          const element = dayRawData[j];
          // console.log("element :: ", element);
          const tempDayEpisodeData: DayEpisodeData = {
            showName: element._embedded.show.name,
            time: element.airtime,
            episodeNumber: element.number,
            image: element._embedded.show.image.medium,
            showId: element.id,
          };

          filteredDayEpisodeData.push(tempDayEpisodeData);
        }
        tempDayData.dayEpisodesData = filteredDayEpisodeData;
        filteredTempDayData.push(tempDayData);
      }

      setFilteredDayData(filteredTempDayData);
    } catch (error) {
      console.error("Error fetching series :: ", error);
    } finally {
      //
    }
  };

  const hasFetched = useRef<boolean>(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchData();
  }, []);

  // useEffect(() => {
  //   console.log("filteredDayData UPDATED :: ", filteredDayData);
  // }, [filteredDayData]);

  return (
    <div>
      <div className="flex flex-col gap-y-8">
        <Header />
        <div className="flex gap-x-4">
          <DayScheduleCard dayData={filteredDayData} />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
