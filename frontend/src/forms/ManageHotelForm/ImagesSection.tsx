import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const ImagesSection = () => {
  const {
    register,
    formState: { errors },
    watch, // used for view detial of hotel - edit hotel option as we geturl of cloudinary
    setValue,
  } = useFormContext<HotelFormData>();

  const existingImageUrls = watch("imageUrls"); // edit hotel
  const handleDelete = (
    // edit hotel
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageUrl: string
  ) => {
    event.preventDefault(); // default is submit form so we are stopping
    setValue(
      "imageUrls",
      existingImageUrls.filter((url) => url !== imageUrl) // filtering tout the current image url and setting up the new update value
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border rounded p-4 flex flex-col gap-4">
        {existingImageUrls && ( //edit hotel
          <div className="grid  grid-cols-6 gap-4">
            {existingImageUrls.map((url) => (
              <div className="relative group">
                <img src={url} className="min-h-full object-cover" />
                <button
                  onClick={(event) => handleDelete(event, url)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full text-gray-700 font-normal"
          {...register("imageFiles", {
            validate: (imageFile) => {
              const totalLength =
                imageFile.length + (existingImageUrls?.length || 0); // checking if added the new hotel if there are currently existing hotel url or not as edit hotel

              if (totalLength === 0) {
                return "* At least one image file should be uploaded";
              }
              if (totalLength > 8) {
                return "* Select only upto 8 image files";
              }
              return true;
            },
          })}
        />
      </div>
      {errors.imageFiles && (
        <span className="text-red-500 text-sm font-bold">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  );
};
export default ImagesSection;
