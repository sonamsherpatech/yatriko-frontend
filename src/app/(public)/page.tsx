import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="flex flex-col gap-x-20 md:flex-row items-center justify-between px-18 py-16 bg-gray-50">
        <div className="md:w-1/2  mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight mb-6">
            <div>
              Discover <span className="text-blue-600">Amazing</span>
            </div>
            <span className="text-blue-700">Tours</span> and{" "}
            <span className="text-blue-500">Adventures</span>
          </h1>

          <p className="text-gray-600 mb-6">
            Explore tours from trusted organizations and start your next journey
            today.
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
            Register
          </button>
        </div>
        <div className="relative h-[600px] w-[1200px]">
          <Image
            src="/static/images/Hero_Image.jpg"
            alt="Hero"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      <section className="px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Tours Offered by Organizations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          <div className="border rounded-lg p-4 shadow hover:shadow-md transition  hover:border-green-400">
            <img
              src="/tour-image.jpg"
              alt="Tour"
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h3 className="font-semibold text-lg text-blue-600">Tour Title</h3>
            <p className="text-gray-600 text-sm">Price: $500</p>
            <p className="text-gray-600 text-sm">No. of Persons: 4</p>
            <p className="text-gray-600 text-sm">StartDate - EndDate</p>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <a href="#" className="text-blue-600 hover:underline">
            See More
          </a>
        </div>
      </section>

      <section className="px-8 py-12 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Organizations on this Platform
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4 shadow hover:shadow-md transition">
            <img
              src="/org-logo.png"
              alt="Organization"
              className="w-20 h-20 object-contain mb-4"
            />
            <h3 className="font-semibold text-lg text-blue-600">
              Organization Name
            </h3>
            <p className="text-gray-600 text-sm">Address: Kathmandu, Nepal</p>
            <p className="text-gray-600 text-sm">Email: info@org.com</p>
            <p className="text-gray-600 text-sm">Contact: +977 9800000000</p>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <a href="#" className="text-blue-600 hover:underline">
            See More
          </a>
        </div>
      </section>
    </div>
  );
}
