import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div className='bg-sky-50 min-h-screen'>
      {/* Hero Section */}
      <div className='relative h-[80vh] bg-gradient-to-br from-sky-800 to-slate-800 flex flex-col justify-center items-center text-white px-4'>
        <h1 className='text-4xl sm:text-6xl font-bold mb-4 text-center drop-shadow-lg'>
          Welcome to <span className='text-yellow-400'>LandQueue</span>
        </h1>
        <p className='text-md sm:text-lg text-gray-200 mb-6 text-center max-w-xl'>
          Discover hand-picked homes, best rental deals & exclusive listings tailored just for you.
        </p>
        <Link
          to='/search'
          className='bg-yellow-400 text-slate-900 px-6 py-3 rounded-lg shadow-lg text-sm font-bold hover:bg-yellow-300 transition'
        >
          Start Exploring →
        </Link>
      </div>

      {/* Swiper Section */}
      <div className='mt-[-60px] z-10 relative px-4 max-w-6xl mx-auto'>
        <Swiper navigation loop={offerListings.length > 2} className='rounded-lg overflow-hidden shadow-xl'>

          {offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
  {listing.imageUrls && listing.imageUrls.length > 0 ? (
    <div
      className='h-[500px] w-full bg-center bg-no-repeat bg-cover relative rounded-lg overflow-hidden shadow-lg'
      style={{ backgroundImage: `url(${listing.imageUrls[0]})` }}
    >
      <div className='absolute bottom-0 left-0 p-4 bg-black bg-opacity-50 text-white w-full text-lg font-semibold'>
        {listing.name} — ₹{listing.regularPrice.toLocaleString('en-IN')}
      </div>
    </div>
  ) : (
    <div className='h-[500px] bg-gray-300 flex items-center justify-center text-gray-700 text-lg'>
      Image not available
    </div>
  )}
              </SwiperSlide>

          ))}
        </Swiper>
      </div>

      {/* Listings */}
      <div className='max-w-6xl mx-auto px-4 py-12 space-y-12'>
        {/* Offers */}
        {offerListings.length > 0 && (
          <section>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-bold text-slate-800'>🔥 Recent Offers</h2>
              <Link to='/search?offer=true' className='text-blue-700 hover:underline text-sm'>
                See all offers
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {offerListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </section>
        )}

        {/* Rentals */}
        {rentListings.length > 0 && (
          <section>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-bold text-slate-800'>🏠 Rentals</h2>
              <Link to='/search?type=rent' className='text-blue-700 hover:underline text-sm'>
                See all rentals
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {rentListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </section>
        )}

        {/* Sales */}
        {saleListings.length > 0 && (
          <section>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-bold text-slate-800'>🏡 Properties for Sale</h2>
              <Link to='/search?type=sale' className='text-blue-700 hover:underline text-sm'>
                See all sales
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {saleListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
