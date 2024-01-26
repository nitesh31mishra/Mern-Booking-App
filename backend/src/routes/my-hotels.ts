// This file is for - lets user to create hotel, update and view their own hotels

import express, {Request, Response, Router} from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import Hotel from '../models/hotel';
import verifyToken from '../middleware/auth';
import { body } from 'express-validator';
import { HotelType } from '../shared/types'

const router = express.Router();
const storage = multer.memoryStorage(); // tells multer to store imgaes in memory 
const upload = multer({
    storage: storage,
    limits:{
        fileSize: 5*1024*1024 // 5MB image file size
    } 
});

// api/my-hotels
router.post(
    "/",
    verifyToken, [
        body("name").notEmpty().withMessage('Name is required'),
        body("city").notEmpty().withMessage('City is required'),
        body("country").notEmpty().withMessage('Country is required'),
        body("description").notEmpty().withMessage('Description is required'),
        body("type").notEmpty().withMessage('Hotel Type is required'),
        body("pricePerNight").notEmpty().isNumeric().withMessage('Price per night is required and must be a number'),
        body("facilities").notEmpty().isArray().withMessage('Facilities are required'),
    ],
    upload.array("imageFiles", 8), 
    async (req: Request,res: Response)=>{

    // multipart form object - if working with images - handled using multer
    try{
        const imageFiles = req.files as Express.Multer.File[]; // here we get image files
        const newHotel: HotelType = req.body;

        // upload images on cloudinary and get promises arry - at bottom we have function
        const imageUrls = await uploadImages(imageFiles); // wait for all image to be uploaded and getting assigned here in new variable
        
        newHotel.imageUrls = imageUrls;
        newHotel.lastUpdated = new Date(); 
        newHotel.userId = req.userId; // from cookie we are getting the userId in the request as its stored - verifyToken
       
        // save new hotel to datasbse
        const hotel = new Hotel(newHotel);
        await hotel.save();
        
        // return 201 status
        res.status(201).send(hotel);
    }
    catch(error){
        console.log("Error Creating Hotel:", error);
        res.status(500).send({message: "Something went wrong."});
    }
});

// get all hotel 
router.get('/',verifyToken, async (req: Request, res: Response) => {
    try{
        const hotels = await Hotel.find({userId: req.userId});
        res.json(hotels);
    }catch(error){
        res.status(500).json({message: "Error Fetching hotels."})
    }
});

// get hotel with speicific Id
router.get('/:id',verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id.toString();
    try{ 
        const hotel = await Hotel.findOne({_id: id, userId: req.userId });
        res.json(hotel);
    }catch(error){
        res.status(500).json({message: "Error Fetching hotels."})
    }
});

// update the hotel
router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const updatedHotel: HotelType = req.body;
      updatedHotel.lastUpdated = new Date();

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        updatedHotel,
        { new: true }
      );

      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      const files = req.files as Express.Multer.File[];
      const updatedImageUrls = await uploadImages(files);

      hotel.imageUrls = [
        ...updatedImageUrls,
        ...(updatedHotel.imageUrls || []),
      ];

      await hotel.save();
      res.status(201).json(hotel);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong." });
    }
  }
);



async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64"); // b64 string from image
        let dataURI = "data:" + image.mimetype + ";base64," + b64; // string describing the image
        const res = await cloudinary.v2.uploader.upload(dataURI); // using cloudinary sdk to upload image to cloudinary
        return res.url; /// return hosted image url 
    });

    const imageUrls = await Promise.all(uploadPromises); // wait for all image to be uploaded and getting assigned here in new variable
    return imageUrls;
};

export default router;