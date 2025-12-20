import React from 'react';
import { Link } from "react-router-dom";
import './Footer.css';

const Footer = () => {
  return (
    <div className='footer'>
        <h6 className='text-center'>
            All Right Reserved &copy; EShop
        </h6>
        <p className='text-center mt-3'>
          <Link to="/about">About Us</Link> |
          <Link to="/contact">Contact Us</Link> |
          <Link to="/policy">Privacy Policy</Link>
        </p>
    </div>
  );
};

export default Footer;