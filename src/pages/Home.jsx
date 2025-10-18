import React from 'react';
import Hero from '../components/Home/Hero';
import About from '../components/Home/About';
import Services from '../components/Home/Services';
import Location from '../components/Home/Location';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <Hero />
      <About />
      <Services />
      <Location />
    </div>
  );
}

export default Home;
