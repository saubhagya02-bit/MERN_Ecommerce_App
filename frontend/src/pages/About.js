import React from 'react';
import Layout from '../components/Layout/Layout';
import './About.css';

const About = () => {
  return (
    <Layout title={"About Us"}>
    <div className='about'>
          <h1 className='content'>About Us</h1>
          <p>Welcome to EShop! We are dedicated to providing you with the best online shopping experience. Our goal is to offer high-quality products, excellent customer service and a seamless shopping journey. We value your trust and are always here to help you find what you need.</p>
          
          <h2>Our Mission</h2>
          <p>To make shopping simple, enjoyable and accessible for everyone.</p>

          <h2>Our Vision</h2>
          <p>To be your go-to destination for all your shopping needs, delivering quality and satisfaction every time.</p>
        </div>
    </Layout>
  )
}

export default About;