import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc',
  });

  const [showFilters, setShowFilters] = useState(false);

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'createdAt',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setShowMore(data.length > 8);
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;

    if (id === 'searchTerm') {
      setSidebardata({ ...sidebardata, [id]: value });
    } else if (id === 'sort_order') {
      const [sort, order] = value.split('_');
      setSidebardata({ ...sidebardata, sort, order });
    } else if (['all', 'rent', 'sale'].includes(id)) {
      setSidebardata({ ...sidebardata, type: id });
    } else {
      setSidebardata({ ...sidebardata, [id]: checked });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const startIndex = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
    const data = await res.json();
    if (data.length < 9) setShowMore(false);
    setListings([...listings, ...data]);
  };

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-gray-50'>
      {/* Sidebar */}
      <div className='w-full md:w-72 bg-white p-6 border-r shadow-sm'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <h2 className='text-xl font-semibold text-slate-700'>Search Filters</h2>

          {/* Search Term */}
          <div>
            <label htmlFor='searchTerm' className='block text-sm font-medium text-gray-700'>Search Term</label>
            <input
              id='searchTerm'
              type='text'
              value={sidebardata.searchTerm}
              onChange={handleChange}
              placeholder='e.g. apartment, roni'
              className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-slate-500 focus:outline-none transition'
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>Type</label>
            <div className='flex gap-3 mt-2'>
              {['all', 'rent', 'sale'].map((val) => (
                <button
                  key={val}
                  type='button'
                  id={val}
                  onClick={handleChange}
                  className={`px-4 py-1 rounded-full border text-sm font-medium transition ${
                    sidebardata.type === val
                      ? 'bg-slate-700 text-white border-slate-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {val.charAt(0).toUpperCase() + val.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Boolean Filters */}
          <div className='grid grid-cols-2 gap-4 text-sm'>
            {[
              { id: 'parking', label: 'Parking' },
              { id: 'furnished', label: 'Furnished' },
              { id: 'offer', label: 'Offer' },
            ].map(({ id, label }) => (
              <label key={id} className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id={id}
                  checked={sidebardata[id]}
                  onChange={handleChange}
                  className='accent-slate-700 w-4 h-4 rounded focus:ring-slate-700'
                />
                <span>{label}</span>
              </label>
            ))}
          </div>

          {/* Sort Order */}
          <div>
            <label htmlFor='sort_order' className='block text-sm font-medium text-gray-700'>Sort By</label>
            <select
              id='sort_order'
              value={`${sidebardata.sort}_${sidebardata.order}`}
              onChange={handleChange}
              className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-slate-500 focus:outline-none transition'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>

          {/* Submit */}
          <button className='mt-4 bg-slate-700 hover:bg-slate-800 text-white py-2 rounded-lg transition text-sm font-medium'>
            Apply Filters
          </button>
        </form>
      </div>

      {/* Listings Section */}
      <div className='flex-1 p-6 overflow-y-auto'>
        <h2 className='text-2xl font-bold text-slate-800 mb-6'>Listings</h2>

        {loading && (
          <p className='text-slate-700 text-lg animate-pulse'>Loading...</p>
        )}

        {!loading && listings.length === 0 && (
          <p className='text-slate-700 text-lg'>No listings found.</p>
        )}

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
  {!loading &&
    listings.map((listing) => (
      <div
        key={listing._id}
        className='transition transform hover:-translate-y-1 hover:shadow-2xl rounded-xl overflow-hidden'
      >
        <ListingItem listing={listing} />
      </div>
    ))}
</div>


        {showMore && (
          <div className='mt-8 flex justify-center'>
            <button
              onClick={onShowMoreClick}
              className='bg-slate-700 hover:bg-slate-800 text-white px-6 py-2 rounded-lg transition text-sm font-medium'
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
