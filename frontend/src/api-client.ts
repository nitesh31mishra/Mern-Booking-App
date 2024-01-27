import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { HotelSearchResponse, HotelType } from '../../backend/src/shared/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL  // as we are use VITE so for env variable we have to use this

export const register = async (formData: RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`,{
        method: 'POST',
        credentials: "include", // include any http cookie along with request // browser sets the cookies automatically
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
    });

    const responseBody = await response.json();

    if (!response.ok){ /// as responseBody.ok is undefined so...
        throw new Error(responseBody.message);
    }
};


export const signIn = async (formData: SignInFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, { 
        method: 'POST',
        credentials: "include",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)

});

    const body = await response.json();
    if (!response.ok){
        throw new Error(body.message);
    }
    return body;

};

export const validateToken = async () => {
    const response = await fetch (`${API_BASE_URL}/api/auth/validate-token`, { 
        credentials: "include" // this will passs cookie
    });
    if (!response.ok){
        throw new Error("Token Invalid!")
    }
    
    return response.json();
};


export const signOut = async () => {

    const response = await fetch(`${API_BASE_URL}/api/auth/logout`,{
        credentials: "include",
        method: "POST",
    });
    if (!response.ok){
        throw new Error("Error during Logout!")
    }
    
};

export const addMyHotel = async (hotelFormData: FormData) => {

    const response = await fetch(`${API_BASE_URL}/api/my-hotels`,{
        credentials: "include",
        method: "POST",
        body: hotelFormData,
    });
    if (!response.ok){
        throw new Error("Failed to add hotel!")
    }

    return response.json();
    
};

// gets the hotel added by user
export const fetchMyHotels = async () : Promise<HotelType[]> => {

    const response = await fetch(`${API_BASE_URL}/api/my-hotels`,{
        credentials: "include",
    });
    if (!response.ok){
        throw new Error("Error Fetching Hotel!")
    }

    return response.json();
    
};

// gets the hotel added by user
export const fetchMyHotelById = async (hotelId: string) : Promise<HotelType> => {

    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`,{
        credentials: "include",
    });
    if (!response.ok){
        throw new Error("Error Fetching Hotel!")
    }

    return response.json();
    
};

// update hotel
export const updateMyHotelById = async (hotelFormData: FormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,
    {
      method: "PUT",
      body: hotelFormData,
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Hotel");
  }

  return response.json();
};

// search params
export type SearchParams = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adultCount?: string;
  childCount?: string;
  page?: string;
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOption?: string;
};

export const searchHotels = async(searchParams: SearchParams): Promise<HotelSearchResponse> =>{
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("checkIn", searchParams.checkIn || "");
    queryParams.append("checkOut", searchParams.checkOut || "");
    queryParams.append("adultCount", searchParams.adultCount || "");
    queryParams.append("childCount", searchParams.childCount || "");
    queryParams.append("page", searchParams.page || "");

    // for sorting and filters
    queryParams.append("maxPrice", searchParams.maxPrice || "");
    queryParams.append("sortOption", searchParams.sortOption || "");

    searchParams.facilities?.forEach((facility) =>
        queryParams.append("facilities", facility)
    );

    searchParams.types?.forEach((type) => queryParams.append("types", type));
    searchParams.stars?.forEach((star) => queryParams.append("stars", star));

    const response = await fetch(
        `${API_BASE_URL}/api/hotels/search?${queryParams}`
    );

    if (!response.ok) {
        throw new Error("Error fetching hotels");
    }

    return response.json();

};