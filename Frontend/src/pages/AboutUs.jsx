import React from 'react';

const AboutUs = () => {
  return (
    <div className="max-w-6xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-900">
        Welcome to Fashion Store
      </h2>

      {/* Container for the content */}
      <div className="overflow-y-auto bg-gray-50 p-6 rounded-lg shadow-md h-[700px]">
        {/* Section 1: Introduction */}
        <div className="mb-10">
          <img 
            src="https://images.pexels.com/photos/27308641/pexels-photo-27308641/free-photo-of-roof.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Fashion Store Logo" 
            className="mx-auto mb-4 w-1/2" 
          />
          <h3 className="text-3xl font-semibold mb-4 text-center">
            The Ultimate Fashion Destination
          </h3>
          <p className="text-lg leading-relaxed mb-4 text-gray-700">
            Fashion Store is your ultimate shopping destination for the latest and trendiest clothing,
            accessories, and footwear. Our mission is to make you feel confident and stylish while offering 
            a wide range of options that cater to every taste and occasion.
          </p>
        </div>

        {/* Section 2: Why Choose Us */}
        <div className="flex gap-6 mb-10">
          <div className="flex-1">
            <img 
              src="https://images.pexels.com/photos/27239701/pexels-photo-27239701/free-photo-of-outfit.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Fashion Image" 
              className="rounded-lg shadow-lg w-full h-64 object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold mb-4">Why Choose Fashion Store?</h3>
            <ul className="list-disc pl-6 mb-4 text-lg text-gray-700">
              <li>Premium quality clothing at affordable prices</li>
              <li>Stylish designs suitable for any occasion</li>
              <li>Personalized styling advice and recommendations</li>
              <li>Fast, reliable, and eco-friendly shipping</li>
              <li>Exceptional customer service with easy returns</li>
            </ul>
            <p className="text-lg leading-relaxed mb-4">
              We are committed to providing our customers with an outstanding shopping experience, 
              from discovering the latest trends to receiving your orders. Fashion Store is here to help you look
              and feel your best at all times.
            </p>
          </div>
        </div>

        {/* Section 3: Our Promise */}
        <div className="mb-10">
          <h3 className="text-3xl font-semibold mb-4 text-center">Our Promise</h3>
          <p className="text-lg leading-relaxed mb-4 text-gray-700">
            At Fashion Store, we promise to deliver the best in fashion and quality. Our goal is to create
            a shopping experience that leaves you feeling happy, confident, and stylish. We will always be
            here to help with any questions or concerns, and we look forward to continuing to serve you!
          </p>
          <img 
            src="https://images.pexels.com/photos/28409105/pexels-photo-28409105/free-photo-of-confident-latina-woman-posing-outdoors-in-summer.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" 
            alt="Fashion Sneakers" 
            className="rounded-lg shadow-xl w-full h-72 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
