import express,{Request, Response} from "express";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";
// routes for searching hotels
const router = express.Router();


//api/my-bookings
router.get("/", verifyToken, async(req: Request, res: Response) => {
   userId: req.params

   try{
    const hotels = await Hotel.find({
        bookings: { $elemMatch: {userId: req.userId}},  // will go in hotels check the bookings array inside that check the userID and return all of them
    });

    // above will return all the bookings for that hotel so we need to filter - all the users who have booked this hotel
    const results = hotels.map((hotel)=>{
        const userBookings = hotel.bookings.filter((booking)=> booking.userId === req.userId);

        const hotelWithUserBookings : HotelType = {
            ...hotel.toObject(),
            bookings: userBookings,
        };

        return hotelWithUserBookings;
    });

    res.status(200).send(results);


   }
   catch(error){
    console.log(error);
    res.status(500).json({message:"Unable to fetch bookings"});
   }
});

export default router;