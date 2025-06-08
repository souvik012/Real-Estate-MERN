import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { useSelector } from "react-redux";
// import Contact from "../components/Contact";

export default function Listing() {
  const [listing, setListing] = useState(null);
  //const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  // Set default selected image when listing loads
  useEffect(() => {
    console.log("Listing fetched:", listing);
    if (listing && listing.imageUrls.length > 0) {
      setSelectedImage(listing.imageUrls[0]);
    }
  }, [listing]);

  if (loading) return <p className="text-center text-2xl mt-20">Loading...</p>;
  if (error) return <p className="text-center text-2xl text-red-500 mt-20">Something went wrong!</p>;







  return (
    <main className="bg-[#f9fafb] min-h-screen">
      {listing && (
        <>
          {/* Image viewer with thumbnails */}
          <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-6">
            {/* Left: Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-auto snap-x md:snap-y">
              {listing.imageUrls.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt="Thumbnail"
                  onClick={() => setSelectedImage(url)}
                  className={`w-24 h-24 object-cover rounded cursor-pointer border-2 snap-start ${
                    selectedImage === url ? "border-blue-500" : "border-transparent"
                  }`}
                />
              ))}
            </div>


            {/* Right: Selected image */}
            <div className="flex-1 flex items-center justify-center">
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="max-w-full max-h-[500px] object-contain rounded shadow"
                />
              )}
            </div>
          </div>

          {/* Listing details */}
          <div className="max-w-6xl mx-auto p-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <h1 className="text-3xl font-bold">{listing.name}</h1>

                {/* Share button */}
                <div className="flex items-center gap-3 mt-4 md:mt-0">
                  <div
                    className="p-3 bg-white rounded-full shadow-lg cursor-pointer hover:scale-110 transition"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    <FaShare className="text-gray-700 text-xl" />
                  </div>
                  {copied && (
                    <p className="bg-white text-black py-2 px-4 rounded-md shadow-md">
                      Link copied!
                    </p>
                  )}
                </div>
              </div>

              {/* Price */}
              <p className="text-2xl font-semibold text-red-700">
                {listing.offer && listing.discountedPrice != null ? (
                  <>
                    ${Number(listing.discountedPrice).toLocaleString()}
                    <span className="text-sm text-gray-600 ml-2 line-through">
                       ${Number(listing.regularPrice).toLocaleString()}
                    </span>
                    <span className="text-sm text-green-600 ml-2">
                       (
                      {(
                        ((Number(listing.regularPrice) - Number(listing.discountedPrice)) /
                          Number(listing.regularPrice)) *
                        100
                      ).toFixed(0)}
                      % OFF)
                    </span>
                  </>
                ) : (
                  <>${Number(listing.regularPrice).toLocaleString()}</>
                )}
              </p>





              {/* Address */}
              <p className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="text-green-700 mr-2" />
                {listing.address}
              </p>

              {/* Tags */}
              <div className="flex gap-4 flex-wrap">
                <span className="px-4 py-2 rounded-full bg-blue-950 text-white">
                  {listing.type === "rent" ? "For Rent" : "For Sale"}
                </span>
                {listing.offer &&
  listing.regularPrice != null &&
  listing.discountedPrice != null && (
    <span className="px-4 py-2 rounded-full bg-blue-700 text-white">
      Save ${(+listing.regularPrice - +listing.discountedPrice).toLocaleString()}
    </span>
)}


              </div>

              {/* Description */}
              <p className="text-gray-700">
                <span className="font-semibold text-black">Description: </span>
                {listing.description}
              </p>

              {/* Features */}
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-blue-950 font-semibold">
                <li className="flex items-center gap-2">
                  <FaBed /> {listing.bedrooms} {listing.bedrooms > 1 ? "Beds" : "Bed"}
                </li>
                <li className="flex items-center gap-2">
                  <FaBath /> {listing.bathrooms} {listing.bathrooms > 1 ? "Baths" : "Bath"}
                </li>
                <li className="flex items-center gap-2">
                  <FaParking /> {listing.parking ? "Parking" : "No Parking"}
                </li>
                <li className="flex items-center gap-2">
                  <FaChair /> {listing.furnished ? "Furnished" : "Unfurnished"}
                </li>
              </ul>

              {/* Contact landlord button */}
              

{(
  <button
    onClick={() => {
      if (confirm("Do you want to call?")) {
        window.location.href = `tel:${listing.contactNumber}`;
      }
    }}
    className="mt-4 w-full md:w-1/2 mx-auto bg-green-600 text-white py-3 rounded-lg hover:opacity-90 transition"
  >
    Call Owner
  </button>
)}


              {/* {contact && <Contact listing={listing} />} */}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
