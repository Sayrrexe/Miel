"use client";
/* eslint-disable @next/next/no-img-element */

// Определение типов пропсов
type AvatarLoadingProps = {
  photo: string | null; // Accepting null now
  setPhoto: React.Dispatch<React.SetStateAction<string | null>>;
};

export const AvatarLoading = ({ photo, setPhoto }: AvatarLoadingProps) => {
  const triggerFileInput = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*"; // Only images allowed

    // Handle file change
    fileInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      if (files && files.length > 0) {
        const file = files[0];

        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setPhoto(reader.result as string);
          }
        };

        reader.readAsDataURL(file); // Read the file as a data URL
      }
    };

    fileInput.click(); // Trigger file input
  };

  return (
    <div className="flex justify-center mt-5">
      <div>
        {photo ? (
          <img
            src={photo}
            alt="User Avatar"
            className="w-[100px] h-[100px] rounded-full object-cover border-2 border-gray-300 cursor-pointer"
            onClick={triggerFileInput} // Click on image to change it
          />
        ) : (
          <div
            onClick={triggerFileInput}
            className="w-[90px] h-[90px] flex items-center justify-center rounded-full border-2 border-gray-300 cursor-pointer bg-gray-100 hover:bg-gray-300"
            aria-label="Upload Avatar"
          >
            <span className="text-3xl text-gray-500">+</span>
          </div>
        )}
      </div>
    </div>
  );
};
