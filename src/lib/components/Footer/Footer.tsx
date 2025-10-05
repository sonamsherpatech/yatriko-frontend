import Image from "next/image";

export default function Footer() {
  return (
    <footer className="px-8 py-8 bg-blue-600 text-white">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8 gap-x-16">
        <div>
          <a href="/">
            <Image
              src="/static/images/logo_yatriko.png"
              alt="Logo"
              width={120}
              height={120}
              className="mb-6 object-contain"
            />
          </a>
          <p className="text-sm">
            We connect travelers with unforgettable tours and experiences. Our
            mission is to make exploring the world simple, safe, and inspiring.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Links</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Services
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Social</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Twitter
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Instagram
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Map</h4>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16791.890600109386!2d85.34604445699031!3d27.777120662735882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1d004ba8ef31%3A0x474c418d36ea9979!2sGen-Z%20Chowk%20budhanilkantha!5e0!3m2!1sen!2snp!4v1759117798241!5m2!1sen!2snp"
            width={400}
            height={250}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </footer>
  );
}
