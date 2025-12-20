import React from 'react';
import Layout from '../components/Layout/Layout';
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
import './Contact.css';

const Contact = () => {
  return (
    <Layout title={"Contact Us"}>
    <div className='contact'>
      <h1 className='content'>Contact Us</h1>
      <p>We’d love to hear from you! Whether you have questions, feedback or need assistance, feel free to reach out to us. Our team is here to help and will get back to you as soon as possible.</p>
      <p className='mt-3'>
        <BiMailSend/> : ushanisaubhagya97@gmail.com
      </p>
      <p className='mt-3'>
        <BiPhoneCall/> : 076-9379125
      </p>
      <p className='mt-3'>
        <BiSupport/> : 0000-0000-0000
      </p>
    </div>
    </Layout>
  );
};

export default Contact;