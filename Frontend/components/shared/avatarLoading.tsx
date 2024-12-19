"use client";
/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Props {
  className?: string;
}

export const AvatarLoading: React.FC<Props> = ({ className }) => {
  const [avatar, setAvatar] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    console.log(file);

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setAvatar(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = handleFileSelect;
    fileInput.click();
  };
  return (
    <div className={cn("", className)}>
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
