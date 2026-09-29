"use client";

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    message: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    console.log(formData);
  }

  return (
    <main>
      <h1>Contact</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name </label>
          <input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div>
          <label>Phone </label>
          <input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>

        <div>
          <label>Email </label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div>
          <label>Address (optional) </label>
          <input id="address" name="address" value={formData.address} onChange={handleChange} />
        </div>

        <div>
          <label>Message </label>
          <textarea id="message" name="message" value={formData.message} onChange={handleChange} required />
        </div>

        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
