import { Link } from 'react-router-dom';

const ListingItem = ({ listing }) => {
  // Safely determine which price to show
  const price =
    listing.offer && listing.discountPrice != null
      ? listing.discountPrice
      : listing.regularPrice;

  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 bg-white">
      <Link to={`/listing/${listing._id}`}>
        {/* Listing Image */}
        <img
          src={listing.imageUrls?.[0] || 'https://via.placeholder.com/400x300'}
          alt={listing.name || 'Listing Image'}
          className="w-full h-48 object-cover"
        />

        {/* Listing Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {listing.name || 'No title'}
          </h3>

          <p className="text-sm text-gray-600 truncate">
            {listing.address || 'No address provided'}
          </p>

          <p className="text-green-600 font-semibold mt-2">
            ₹{price != null ? price.toLocaleString('en-IN') : 'N/A'}
            {listing.type === 'rent' && ' / month'}
          </p>

          <div className="flex gap-4 mt-2 text-sm text-gray-700">
            <span>{listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}</span>
            <span>{listing.bathrooms} {listing.bathrooms > 1 ? 'Baths' : 'Bath'}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
