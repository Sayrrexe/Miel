"use client";
/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";

export const AvatarLoading = () => {
  const avatar = "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const triggerFileInput = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    // Указываем тип события как Event
    fileInput.onchange = (e: Event) => {
      // Приводим e.target к HTMLInputElement
      const target = e.target as HTMLInputElement;
      const files = target.files;
      if (files && files.length > 0) {
        console.log(files);
      }
    };

    fileInput.click();
  };
  return (
    <div className={cn("")}>
      <div style={{ marginTop: "20px" }}>
        {avatar ? (
          <img
            src={avatar}
            alt="User Avatar"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            onClick={triggerFileInput}
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="text-3xl border-gray-400 border-solid border-[1px] hover:bg-gray-300 cursor-pointer"
          >
            <span>+</span>
          </div>
        )}
      </div>
    </div>
  );
};
