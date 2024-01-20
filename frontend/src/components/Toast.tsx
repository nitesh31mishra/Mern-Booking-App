import { useEffect } from "react";

type ToastProps = {
  message: string;
  type: "SUCCESS" | "ERROR";
  onClose: () => void;
};

const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // 5sec timer will call onClose fucntion and render it

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  // const styles =
  //   type === "SUCCESS"
  //      "fixed top-4 right-4 z-50 p-4 rounded-md bg-green-600 text-white max-w-md"
  //     : "fixed top-4 right-4 z-50 p-4 rounded-md bg-red-600 text-white max-w-md";

  // return (
  //   <div className={styles}>
  //     <div className="flex justify-center items-center">
  //       <div>
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           className="w-6 shrink-0 fill-white inline"
  //           viewBox="0 0 32 32"
  //         >
  //           <path
  //             d="M16 1a15 15 0 1 0 15 15A15 15 0 0 0 16 1zm6.36 20L21 22.36l-5-4.95-4.95 4.95L9.64 21l4.95-5-4.95-4.95 1.41-1.41L16 14.59l5-4.95 1.41 1.41-5 4.95z"
  //             data-original="#ea2d3f"
  //           />
  //         </svg>
  //       </div>
  //       <div className="py-2.5 text-base mx-4">
  //         <span className="text-lg font-semibold">{message}</span>
  //       </div>
  //     </div>
  //   </div>
  // );

  const icon =
    type === "SUCCESS" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 shrink-0 fill-white inline mr-2"
        viewBox="0 0 512 512"
      >
        <ellipse
          cx="256"
          cy="256"
          fill="#fff"
          data-original="#fff"
          rx="256"
          ry="255.832"
        />
        <path
          className="fill-green-500"
          d="m235.472 392.08-121.04-94.296 34.416-44.168 74.328 57.904 122.672-177.016 46.032 31.888z"
          data-original="#ffffff"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 shrink-0 fill-white inline mr-2"
        viewBox="0 0 32 32"
      >
        <path
          d="M16 1a15 15 0 1 0 15 15A15 15 0 0 0 16 1zm6.36 20L21 22.36l-5-4.95-4.95 4.95L9.64 21l4.95-5-4.95-4.95 1.41-1.41L16 14.59l5-4.95 1.41 1.41-5 4.95z"
          data-original="#ea2d3f"
        />
      </svg>
    );

  const bgColor = type === "SUCCESS" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-md ${bgColor} text-white max-w-md`}
    >
      <div className="flex justify-center items-center">
        {icon}
        <div className="py-2.5 text-base mx-4">
          <span className="text-lg font-semibold">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default Toast;
