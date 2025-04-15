import { useState } from 'react';
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom'

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    imageUrls: [],
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (id === 'type') {
      setFormData({ ...formData, type: value });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [id]: checked });
    } else {
      setFormData({ ...formData, [id]: type === 'number' ? +value : value });
    }
  };

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData((prev) => ({
            ...prev,
            imageUrls: prev.imageUrls.concat(urls),
          }));
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'realestate_preset');

      fetch('https://api.cloudinary.com/v1_1/dwdbozzsp/image/upload', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => resolve(data.secure_url))
        .catch((err) => reject(err));
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.offer && +formData.discountedPrice >= +formData.regularPrice) {
      return toast.error('Discounted price must be less than regular price');
    }
    
    try {
      const res = await fetch('http://localhost:3000/api/listing/create', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Listing created!');
      navigate(`/listing/${data._id}`);
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    }
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-10'>
  <div className='flex flex-col gap-4 flex-1'>
    <input type='text' placeholder='Name' id='name' required onChange={handleChange} className='border p-3 rounded' />
    <textarea placeholder='Description' id='description' required onChange={handleChange} className='border p-3 rounded' />
    <input type='text' placeholder='Address' id='address' required onChange={handleChange} className='border p-3 rounded' />

    <div className='flex gap-4'>
      <label className='flex items-center gap-2'>
        <input type='radio' id='type' value='sale' name='type' checked={formData.type === 'sale'} onChange={handleChange} /> Sale
      </label>
      <label className='flex items-center gap-2'>
        <input type='radio' id='type' value='rent' name='type' checked={formData.type === 'rent'} onChange={handleChange} /> Rent
      </label>
    </div>

    <div className='flex flex-wrap gap-4'>
      {['offer', 'parking', 'furnished'].map((item) => (
        <label key={item} className='flex gap-2 items-center'>
          <input type='checkbox' id={item} checked={formData[item]} onChange={handleChange} />
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </label>
      ))}
    </div>

    <div className='flex flex-wrap gap-6'>
      <div className='flex items-center gap-2'>
        <input type='number' id='bedrooms' required onChange={handleChange} className='p-3 border rounded' />
        <p>Beds</p>
      </div>
      <div className='flex items-center gap-2'>
        <input type='number' id='bathrooms' required onChange={handleChange} className='p-3 border rounded' />
        <p>Baths</p>
      </div>
      <div className='flex items-center gap-2'>
        <input type='number' id='regularPrice' required onChange={handleChange} className='p-3 border rounded' />
        <div>
          <p>Regular price</p>
          <span className='text-xs'>($/month)</span>
        </div>
      </div>

      {/* Conditional Discounted Price Field */}
      {formData.offer && (
        <div className='flex items-center gap-2'>
          <input
            type='number'
            id='discountedPrice'
            required
            onChange={handleChange}
            value={formData.discountedPrice}
            disabled={!formData.offer}
            className={`p-3 border rounded ${
              +formData.discountedPrice >= +formData.regularPrice ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <div>
            <p>Discount price</p>
            <span className='text-xs'>($/month)</span>
          </div>
        </div>
      )}
    </div>

    {/* Validation message */}
    {formData.offer && +formData.discountedPrice >= +formData.regularPrice && (
      <p className='text-red-600 text-sm'>
        Discounted price must be less than the regular price.
      </p>
    )}
  </div>

  <div className='flex flex-col flex-1 gap-4'>
    <p className='font-semibold'>
      Images:
      <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
    </p>

    <div className='flex flex-col gap-2'>
      <div className='flex gap-4 items-center'>
        <label
          htmlFor='images'
          className='cursor-pointer bg-gradient-to-r from-blue-400 to-blue-600 text-white font-medium rounded-lg px-5 py-3 flex items-center gap-2 shadow-md hover:shadow-xl transition duration-300'
        >
          <span> Choose Images</span>
        </label>
        <input
          onChange={(e) => setFiles(e.target.files)}
          type='file'
          id='images'
          accept='image/*'
          multiple
          className='hidden'
        />
        <button
          type='button'
          disabled={uploading}
          onClick={handleImageSubmit}
          className='p-3 text-blue-700 border border-blue-700 rounded-lg uppercase font-medium hover:bg-green-50 hover:shadow-md disabled:opacity-80 transition duration-300'
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {files.length > 0 && (
        <p className='text-sm text-gray-600 ml-1'>{files.length} file(s) selected</p>
      )}
    </div>

    <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>

    {formData.imageUrls.length > 0 &&
      formData.imageUrls.map((url, index) => (
        <div key={`${url}-${index}`} className='flex justify-between p-3 border items-center'>
          <img src={url} alt='listing image' className='w-20 h-20 object-contain rounded-lg' />
          <button
            type='button'
            onClick={() => handleRemoveImage(index)}
            className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
          >
            Delete
          </button>
        </div>
      ))}

    {/* Submit Button with Disabled Logic */}
    <button
      type='submit'
      disabled={
        uploading ||
        (formData.offer && +formData.discountedPrice >= +formData.regularPrice)
      }
      className='p-3 bg-blue-900 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
    >
      Create Listing
    </button>
  </div>
</form>

    </main>
  );
}
