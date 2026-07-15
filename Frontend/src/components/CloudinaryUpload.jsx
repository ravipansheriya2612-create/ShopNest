import { ImagePlus, LoaderCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

function CloudinaryUpload({ value, onUpload }) {
    const [uploading, setUploading] = useState(false);

    const openUploadWidget = () => {
        if (!window.cloudinary) {
            toast.error("Cloudinary upload service is unavailable");
            return;
        }

        const cloudName =
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

        const uploadPreset =
            import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            toast.error("Cloudinary configuration is missing");
            return;
        }

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName,
                uploadPreset,
                folder: "shopnest/products",
                multiple: false,
                sources: ["local", "url", "camera"],
                resourceType: "image",
                clientAllowedFormats: [
                    "jpg",
                    "jpeg",
                    "png",
                    "webp",
                ],
                maxFileSize: 5000000,
                cropping: true,
                croppingAspectRatio: 1,
                showSkipCropButton: true,
            },
            (error, result) => {
                if (error) {
                    setUploading(false);
                    toast.error("Image upload failed");
                    return;
                }

                if (result.event === "queues-start") {
                    setUploading(true);
                }

                if (result.event === "success") {
                    setUploading(false);

                    onUpload(result.info.secure_url);

                    toast.success(
                        "Product image uploaded successfully"
                    );
                }

                if (
                    result.event === "close" ||
                    result.event === "abort"
                ) {
                    setUploading(false);
                }
            }
        );

        widget.open();
    };

    return (
        <div className="cloudinary-upload">
            {value ? (
                <div className="upload-preview">
                    <img src={value} alt="Product preview" />

                    <button
                        type="button"
                        onClick={openUploadWidget}
                        disabled={uploading}
                    >
                        <ImagePlus size={17} />
                        Change image
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    className="upload-image-button"
                    onClick={openUploadWidget}
                    disabled={uploading}
                >
                    {uploading ? (
                        <LoaderCircle
                            size={18}
                            className="spin-icon"
                        />
                    ) : (
                        <ImagePlus size={18} />
                    )}

                    {uploading
                        ? "Uploading image..."
                        : "Upload product image"}
                </button>
            )}
        </div>
    );
}

export default CloudinaryUpload;