import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { useQuery } from "react-query";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";

const Detail = () => {
  const { hotelId } = useParams();

  const { data: hotel } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelId as string),
    { enabled: !!hotelId } // checks once we have hotelId value if not then its enabled false and no api call and if value then true
  );

  if (!hotel) {
    return <></>;
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center">
          <span className="flex">
            {Array.from({ length: hotel.starRating }).map(() => (
              <AiFillStar className="fill-yellow-400" />
            ))}
          </span>
          <span className="ml-1 text-sm">{hotel.type}</span>
        </div>
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {hotel.imageUrls.map((image) => (
          <div className="h-[300px]">
            <img
              src={image}
              alt={hotel.name}
              className="rounded-md w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {hotel.facilities.map((facility) => (
          <div className="border border-slate-200 bg-slate-300 rounded-lg p-3 text-sm">
            {facility}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <div className="whitespace-pre-line">{hotel.description}</div>
        <div className="h-fit">
          <GuestInfoForm
            pricePerNight={hotel.pricePerNight}
            hotelId={hotel._id}
          />
        </div>
      </div>
    </div>
  );
};

export default Detail;
