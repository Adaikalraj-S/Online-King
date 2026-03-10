import React, { useState, useEffect } from 'react';
import ReactImageMagnify from 'react-image-magnify';
import './zoom.css';

const ImageGallery = ({ images = [], screen = "lg" }) => {

    const [selectedImage, setSelectedImage] = useState(images[0]);
    const [selectedImageHeight, setSelectedImageHeight] = useState(images[0]);
    const [selectedImageWidth, setSelectedImageWidth] = useState(images[0]);


    useEffect(() => {
        if (images.length > 0) {
            setSelectedImage(images[0]);
        }
    }, [images]);
    
    
    useEffect(() => {
        const img = new Image(); // Create a new image object
        img.src = selectedImage; // Set the source to the image URL

        // Fetch dimensions once the image loads
        img.onload = () => {
            setSelectedImageWidth(img.width); // Set the width
            setSelectedImageHeight(img.height); // Set the width
        };
    }, [selectedImage]);


    return (
        <div className="image-gallery">
            <div className="thumbnails ">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        onClick={() => setSelectedImage(image)}
                        className={`thumbnail ${selectedImage === image ? 'active' : ''}`}
                        alt={`Product Image ${index + 1}`}

                    />
                ))}
            </div>
            <div className="main-image-mobile rouded-lg">
                <img src={selectedImage} />
                {/* {selectedImage && (
                    <>
                    <ReactImageMagnify
                        {...{
                            smallImage: {
                                alt: 'Product Image',
                                isFluidWidth: false, // Use custom width and height
                                src: selectedImage,
                                width: 500,
                                height: 500,
                            },
                            largeImage: {
                                src: selectedImage,
                                width: selectedImageWidth * 3 > 1000 ? 1000 : selectedImageWidth * 3,
                                height: selectedImageHeight * 3 > 1000 ? 1000 : selectedImageHeight * 3,
                            },
                            enlargedImageContainerStyle: {
                                backgroundColor: '#fff',
                                width: `${selectedImageWidth * 3}px`, // Enforce fixed width
                                minWidth: `${selectedImageWidth * 3}px`, // Enforce fixed width
                                maxWidth: `${selectedImageWidth * 3}px`, // Enforce fixed width
                                height: `${selectedImageHeight * 3}px`, // Fixed height to match proportions
                            },
                            enlargedImageStyle: {
                                width: `${selectedImageWidth * 3}px`, // Enforce fixed width
                                height: `${selectedImageHeight * 3}px`, // Fixed height to match proportions
                                objectFit: 'fill', // Ensure no cropping
                                marginLeft: "250px",
                            },
                            enlargedImagePosition: 'bottom', // Change position to 'beside' for better zoom
                            lensStyle: { backgroundColor: 'rgba(0,0,0,.6)' }, // Customize lens style
                            // shouldUsePositiveSpaceLens: true, // Improves zoom quality
                        }}
                    />
                    </>
                )} */}
            </div>
            <div className="main-image rouded-lg">
                {selectedImage && (
                    <>
                    <ReactImageMagnify
                        {...{
                            smallImage: {
                                alt: 'Product Image',
                                isFluidWidth: false, // Use custom width and height
                                src: selectedImage,
                                width: 500,
                                height: 500,
                            },
                            largeImage: {
                                src: selectedImage,
                                width: selectedImageWidth * 3 > 1000 ? 1000 : selectedImageWidth * 3,
                                height: selectedImageHeight * 3 > 1000 ? 1000 : selectedImageHeight * 3,
                            },
                            enlargedImageContainerStyle: {
                                backgroundColor: '#fff',
                                width: `${selectedImageWidth * 3}px`, // Enforce fixed width
                                minWidth: `${selectedImageWidth * 3}px`, // Enforce fixed width
                                maxWidth: `${selectedImageWidth * 3}px`, // Enforce fixed width
                                height: `${selectedImageHeight * 3}px`, // Fixed height to match proportions
                            },
                            enlargedImageStyle: {
                                width: `${selectedImageWidth * 3}px`, // Enforce fixed width
                                height: `${selectedImageHeight * 3}px`, // Fixed height to match proportions
                                objectFit: 'fill', // Ensure no cropping
                                marginLeft: "250px",
                            },
                            enlargedImagePosition: 'bottom', // Change position to 'beside' for better zoom
                            lensStyle: { backgroundColor: 'rgba(0,0,0,.6)' }, // Customize lens style
                            // shouldUsePositiveSpaceLens: true, // Improves zoom quality
                        }}
                    />
                    </>
                )}
            </div>
        </div>
    );
};

export default ImageGallery;
