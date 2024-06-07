import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './HomePage.css';

// Import images
import backImage from '../img/back0.jpg';
import homeBg2 from '../img/back2.avif';
import homeBg3 from '../img/back3.avif';
import About from '../components/About';

const HomePage = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    { background: backImage, content: 'MARKET <br> PLACE', text: '"Ofrrir de la bonne qualiter naturelle, c\'est de générosité <br> \'a la digne et la plus <br>' },
    { background: homeBg2, content: 'Millieur <br> Pustacho', text: '"Ofrrir de la bonne qualiter naturelle, c\'est de générosité <br> \'a la digne et la plus <br>' },
    { background: homeBg3, content: 'Millieur <br> Almond', text: '"Ofrrir de la bonne qualiter naturelle, c\'est de générosité <br> \'a la digne et la plus <br>' }
  ];

  const nextSlide = () => {
    setActiveSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  return (
    <div>
      <Navbar />
      <section className="home" id="home">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === activeSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${slide.background})`
            }}
          >
            {slide.content && (
              <div className="content">
                <span dangerouslySetInnerHTML={{ __html: slide.content }} />
                <h3 dangerouslySetInnerHTML={{ __html: slide.text }} />
                <a href="/" className="btn">read more</a>
              </div>
            )}
          </div>
        ))}
        <div id="next-slide" onClick={nextSlide} className="fas fa-angle-right"></div>
        <div id="prev-slide" onClick={prevSlide} className="fas fa-angle-left"></div>
      </section>
      <About/>
    </div>
  );
};

export default HomePage;
