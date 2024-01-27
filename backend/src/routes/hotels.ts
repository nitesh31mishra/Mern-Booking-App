import express, {Request, Response} from "express";
import Hotel from "../models/hotel";
import { HotelSearchResponse } from "../shared/types";
import e from "express";

// routes for searching hotels
const router = express.Router();

router.get("/search", async(req: Request, res: Response)=>{
    try{
        const query = constructSearchQuery(req.query); // for sorting
        //sorting
        let sortOptions = {};
        switch (req.query.sortOption) {
        case "starRating":
            sortOptions = { starRating: -1 }; // -1 : high to low
            break;
        case "pricePerNightAsc":
            sortOptions = { pricePerNight: 1 };
            break;
        case "pricePerNightDesc":
            sortOptions = { pricePerNight: -1 };
            break;
        }

        //adding pagination
        const pageSize = 5;
        const pageNumber = parseInt( // get which page number user is clicking
            req.query.page? req.query.page.toString():"1"
        );
        // pageNumber = 3 so skip = 10 // so skip first 10 and return result after 10
        const skip = (pageNumber -1) * pageSize;

        const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize);

        const total = await Hotel.countDocuments(query); // total number of hotels
        const response: HotelSearchResponse = { 
            data: hotels,
            pagination: { 
                total: total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize)
            },
        }
        res.json(response);
    }
    catch(error){
        console.log("Error Creating Hotel:", error);
        res.status(500).send({message: "Something went wrong."});
    }

});


const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

   if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

export default router;