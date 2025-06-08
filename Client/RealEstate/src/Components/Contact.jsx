import React from "react";


export default function Contact({ listing }) {
  return (
    <div className="flex flex-col gap-2">
      <p>Contact {listing.name} owner for more details.</p>
      <form className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Your message..."
          className="border p-2 rounded-lg"
        />
        <button className="bg-blue-600 text-white p-2 rounded-lg">
          Send Message
        </button>
      </form>
    </div>
  );
}
