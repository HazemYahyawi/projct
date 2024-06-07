import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './about.css';
import aboutImage from '../img/farmer.avif'; // Adjust the path as needed

const About = () => {
  return (
    <section className="about" id="about">
      <div className="img">
        <img src={aboutImage} alt="About Us" />
      </div>
      <div className="content">
        <div className="box">
          <h3>About <span>Us...</span></h3>
          <p>Bienvenue sur notre boutique en ligne dédiée aux délices de la nature, où la qualité rencontre la gourmandise.
           Découvrez notre sélection exquise de pistaches et d'amandes, soigneusement récoltées et préparées pour vous offrir 
           le meilleur de la saveur et de la fraîcheur.
          </p>
          <a href="/" className="btn">read more</a>
        </div>
        <div className="icons-container">
          <div className="icons">
            <i className="fas fa-address-card"></i>
            <p>address card</p>
          </div>
          <div className="icons">
            <i className="fas fa-award"></i>
            <p>award cards</p>
          </div>
          <div className="icons">
            <i className="fas fa-gift"></i>
            <p>gift cards</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
