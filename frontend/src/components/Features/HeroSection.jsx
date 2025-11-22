import { useEffect } from "react";

export default function HeroSection() {
  useEffect(() => {
    // Bootstrap carousel initialize krega
    const initCarousel = () => {
      if (typeof window !== 'undefined' && window.$ && window.$.fn.carousel) {
        window.$('#carouselExampleIndicators').carousel({
          interval: 3000, // Auto-rotate krega har 3 seconds mein
          ride: 'carousel',
          wrap: true
        });
      }
    };

    // koshish kri initialize immediately krne ki, and also after a short delay to ensure scripts are loaded
    initCarousel();
    const timeout = setTimeout(initCarousel, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full flex justify-center py-6 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-6xl">
        <div 
          id="carouselExampleIndicators" 
          className="carousel slide rounded-xl overflow-hidden shadow-lg" 
          data-ride="carousel"
          style={{ maxHeight: '400px' }}
        >
          <ol className="carousel-indicators">
            <li 
              data-target="#carouselExampleIndicators" 
              data-slide-to="0" 
              className="active"
            ></li>
            <li 
              data-target="#carouselExampleIndicators" 
              data-slide-to="1"
            ></li>
            <li 
              data-target="#carouselExampleIndicators" 
              data-slide-to="2"
            ></li>
          </ol>

          <div className="carousel-inner">
            <div className="carousel-item active">
             
                <img 
                  className="d-block w-full" 
                  src="/Rev.png" 
                  alt="First slide"
                  style={{ 
                    maxHeight: '400px', 
                    maxWidth: '100%', 
                    objectFit: 'cover',
                    
                   
                  }}
                />
              
            </div>
            <div className="carousel-item">
              <img 
                className="d-block w-100" 
                src="/Food.png" 
                alt="Second slide"
                style={{ 
                  height: '400px', 
                  width: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <div className="carousel-item">
              <img 
                className="d-block w-100" 
                src="/Beauty.png" 
                alt="Third slide"
                style={{ 
                  height: '400px', 
                  width: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>

          <a 
            className="carousel-control-prev" 
            href="#carouselExampleIndicators" 
            role="button" 
            data-slide="prev"
            style={{ width: '50px', opacity: 0.8 }}
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
          </a>
          <a 
            className="carousel-control-next" 
            href="#carouselExampleIndicators" 
            role="button" 
            data-slide="next"
            style={{ width: '50px', opacity: 0.8 }}
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="sr-only">Next</span>
          </a>
        </div>
      </div>
    </div>
  );
}
