import { Footer, Header } from "@components";
import type { Crew, EpisodeData } from "@models";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const ShowDetails = () => {
  const [episodeData, setEpisodeData] = useState<EpisodeData>();
  const [crewData, setCrewData] = useState<Crew[]>();

  const handleEpisodeClick = (url: string) => {
    const strParts = url.split("/");
    const id = strParts[strParts.length - 1];
    window.location.href = `/show/${id}`;
  };

  const fetchData = async (id: string) => {
    try {
      const endPoint = `${
        import.meta.env.VITE_API_BASE_URL
      }/episodes/${id}?embed=show`;

      const castEndPoint = `${
        import.meta.env.VITE_API_BASE_URL
      }/episodes/${id}/guestcast`;

      const response = await fetch(endPoint, { method: "GET" });
      const castResponse = await fetch(castEndPoint, { method: "GET" });

      if (!response.ok) throw new Error("Please try again.");
      const data = await response.json();

      if (!castResponse.ok) throw new Error("Please try again.");
      const rawCrewData = await castResponse.json();

      const filterEpisodeData: EpisodeData = {
        id: data.id,
        episodeName: data.name,
        airDate: data.airdate,
        airTime: data.airtime,
        number: data.number,
        url: data.url,
        genres: data._embedded.show.genres,
        image: data._embedded.show.image.medium,
        language: data._embedded.show.language,
        rating: data.rating.average,
        status: data.status,
        summary: data._embedded.show.summary,
        showName: data._embedded.show.name,
        webChannelName: data._embedded.show.webChannel.name,
        prevEpisodeName:
          data._embedded.show._links.previousepisode?.name || null,
        nextEpisodeName: data._embedded.show._links.nextepisode.name,
        prevEpisodeUrl:
          data._embedded.show._links.previousepisode?.href || null,
        nextEpisodeUrl: data._embedded.show._links.nextepisode.href,
      };

      const crewData: Crew[] = [];
      if (rawCrewData.length !== 0) {
        for (let i = 0; i < rawCrewData.length; i++) {
          const tempCrewData: Crew = {
            name: rawCrewData[i].person.name,
            role: rawCrewData[i].character.name,
            pic: rawCrewData[i].person.image.medium,
          };
          crewData.push(tempCrewData);
        }
      }

      setEpisodeData(filterEpisodeData);
      setCrewData(crewData);
    } catch (error) {
      console.error("Error fetching data :: ", error);
    }
  };

  const { id } = useParams();
  const hasFetched = useRef<boolean>(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchData(id ?? "");
  }, []);

  return (
    <div className="flex flex-col gap-y-6 px-10">
      <Header />
      <div className="flex gap-x-10">
        {/* Left section */}
        <div className="flex flex-col gap-y-2 p-4 border-[0.5px] border-[#FFBD1E] w-[30%]">
          <img
            src={episodeData?.image}
            alt="show-img"
            className="bg-gray-200 h-[80%]"
          />
          <div className="flex gap-x-4 h-[20%]">
            <div
              className="p-4 w-[50%] border-[0.5px] border-[#FFBD1E] text-center cursor-pointer"
              onClick={() =>
                handleEpisodeClick(episodeData?.prevEpisodeUrl ?? "")
              }
            >
              <p>Previous Episode</p>
              <p className="text-[8px]">{episodeData?.prevEpisodeName}</p>
            </div>
            <div
              className="p-4 w-[50%] border-[0.5px] border-[#FFBD1E] text-center cursor-pointer"
              onClick={() =>
                handleEpisodeClick(episodeData?.nextEpisodeUrl ?? "")
              }
            >
              <p>Next Episode</p>
              <p className="text-[8px]">{episodeData?.nextEpisodeName}</p>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex flex-col gap-y-4 w-[70%]">
          <div className="flex justify-between">
            <div className="flex flex-col gap-y-2">
              <p className="">{episodeData?.showName}</p>
              <p className="">{episodeData?.episodeName}</p>
              <p className="">{episodeData?.language}</p>
              {episodeData?.genres.length !== 0 ? (
                <p className="">Genre : {episodeData?.genres}</p>
              ) : (
                ""
              )}
            </div>
            <div className="">
              <p className="">{episodeData?.airTime}</p>
              <p className="">{episodeData?.webChannelName}</p>
              <p className="">{episodeData?.rating}</p>
            </div>
          </div>

          <div className="">
            <p className="">Cast & Crew</p>
            {crewData?.length !== 0 ? (
              <div className="grid grid-cols-3 grid-rows-2 p-4 gap-6 w-full border-[0.5px] border-[#FFBD1E]">
                {crewData?.map((element, index) => (
                  <div key={index} className="flex gap-x-4">
                    <img
                      src={element.pic}
                      alt="crew_pic"
                      className="h-10 w-10 rounded-full object-fill"
                    />
                    <div className="flex flex-col gap-y-2">
                      <p className="">{element.name}</p>
                      <p className="">{element.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 gap-6 w-full border-[0.5px] border-[#FFBD1E] items-center opacity-80">
                <p className=" text-8xl text-center">TBA</p>
              </div>
            )}
          </div>
          <div className="">
            <p className=""> Summary: </p>
            <div
              className="text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: episodeData?.summary || "" }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShowDetails;
