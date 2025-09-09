'use client'

import React from 'react'
import { Search } from 'lucide-react'
import Image, { StaticImageData } from 'next/image'

import Google from "../../../public/google.png"
import Airbnb from "../../../public/Airbnb.png"
import Deloitte from "../../../public/Deloitte.png"
import Freelancer from "../../../public/Freelancer.png"
import Samsung from "../../../public/Samsung.png"
import PayPal from "../../../public/PayPal.png"
import Microsoft from "../../../public/microsoft.png"
import IBM from "../../../public/ibm.png"
import airbus from "../../../public/airbus.png"
import Bridgestone from "../../../public/Bridgestone.png"
import Pepsi from "../../../public/pepsi.png"
import PG from "../../../public/p&g.png"
import coco from "../../../public/coca-cola.png"
import Unilever from "../../../public/Unilever.png"
import NASA from "../../../public/NASA.png"
import {
  SiReact,
  SiNodedotjs,
  SiPhp,
  SiPython,
  SiAndroid,
  SiLaravel,
  SiJavascript,
  SiHtml5,
} from "react-icons/si";

import {
  FaBuilding,
  FaGlobe,
  FaUserTie,
  FaUsersCog,
  FaHandshake,
  FaMapMarkerAlt,
  FaCode,
  FaCogs,
} from "react-icons/fa";


  export const Homemetadata ={
    title:'Home',
    description:'This is Home page'
  }

export const Homepage = () => {
  type Providers = { img: StaticImageData }
  type Company = { title: string; desc: string }

  const ProviderItems: Providers[] = [
    { img: Google }, { img: Airbnb }, { img: Deloitte },
    { img: Freelancer }, { img: Samsung }, { img: PayPal },
    { img: Microsoft }, { img: IBM },
    { img: airbus }, { img: Bridgestone },
    { img: Pepsi }, { img: PG },
    { img: coco }, { img: Unilever },
    { img: NASA },
  ]

  const CompanyItems: Company[] = [
    { title: '50000+', desc: 'Verified Agencies' },
    { title: '88+', desc: 'Countries Covered' },
    { title: '3000+', desc: 'In-demand Skills' },
    { title: '90+', desc: 'Service Categories' },
  ]

  const technologies = [
    { name: "Full Stack Development", icon: <SiJavascript size={30} /> },
    { name: "React.js", icon: <SiReact size={30} /> },
    { name: "Node.js", icon: <SiNodedotjs size={30} /> },
    { name: "PHP", icon: <SiPhp size={30} /> },
    { name: "Python", icon: <SiPython size={30} /> },
    { name: "Java", icon: <SiPython size={30} /> },
    { name: "React Native", icon: <SiReact size={30} /> },
    { name: "Android App Development", icon: <SiAndroid size={30} /> },
    { name: "Web Development", icon: <FaCode size={30} /> },
    { name: "HTML", icon: <SiHtml5 size={30} /> },
    { name: "Laravel", icon: <SiLaravel size={30} /> },
    { name: "Software Development", icon: <FaCogs size={30} /> },
  ];



  const services = [
    {
      title: "Enterprise Solutions",
      description: "Robust digital transformation services tailored for large-scale enterprises.",
      icon: <FaBuilding size={30} className="text-blue-600" />
    },
    {
      title: "Global Capability Centers (GCC)",
      description: "Set up and scale world-class GCCs for innovation, operations, and efficiency.",
      icon: <FaGlobe size={30} className="text-green-600" />
    },
    {
      title: "Employer of Record (EOR)",
      description: "Hire globally without legal barriers — we handle compliance and payroll.",
      icon: <FaUserTie size={30} className="text-purple-600" />
    },
    {
      title: "Remote Talent Hiring",
      description: "Access a global pool of top-tier remote professionals across domains.",
      icon: <FaUsersCog size={30} className="text-indigo-600" />
    },
    {
      title: "Contract Staffing Solutions",
      description: "Flexible staffing for project-specific or short-term resource needs.",
      icon: <FaHandshake size={30} className="text-yellow-600" />
    },
    {
      title: "Onsite Staffing",
      description: "Deploy skilled talent onsite for seamless integration with your teams.",
      icon: <FaMapMarkerAlt size={30} className="text-red-600" />
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-bold text-[#1A2B6B] mt-8 mb-4">
          Hire Talent on Contract
        </h1>
        <p className="text-sm sm:text-lg md:text-xl leading-relaxed text-gray-700 max-w-2xl">
          Your single point of access to 500,000+ Talents from 50,000+ top vetted agencies around the globe
        </p>

        {/* Search Bar */}
        <div className="flex items-center w-full max-w-md mx-auto rounded-full overflow-hidden border border-gray-300 mt-6">
          <input
            type="search"
            placeholder="Search: Technology | Company | Category"
            className="w-full text-sm px-4 py-2 outline-none"
          />
          <button className="p-2 bg-[#1A2B6B] text-white hover:bg-[#16245b] transition-colors duration-200">
            <Search size={20} />
          </button>
        </div>

        {/* OR & Post Job */}
        <div className="mt-4">
          <div className="w-10 h-10 mx-auto flex items-center justify-center border border-orange-600 rounded-full text-orange-600 font-semibold">OR</div>
          <button className="bg-orange-600 text-white text-lg sm:text-2xl px-6 py-2 mt-3 rounded-lg hover:bg-orange-700 transition duration-200">
            Post Contract Job (FREE)
          </button>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 w-full max-w-xl">
          {CompanyItems.map((item, index) => (
            <div key={index} className="text-center">
              <h3 className="text-orange-500 font-bold text-lg sm:text-2xl">{item.title}</h3>
              <p className="text-sm sm:text-base text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="bg-gray-100 mt-12 shadow-xl rounded-lg py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl sm:text-4xl font-bold text-gray-700 mb-10">
            Our listed service providers have been trusted by
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {ProviderItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-center bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition duration-300"
              >
                <Image
                  src={item.img}
                  alt="Company Logo"
                  className="object-contain w-full max-w-[80px] h-auto sm:max-w-[100px]"
                  priority
                />
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto px-4 py-12 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
              Tap Into the Best Tech Talent
            </h2>
            <p className="text-gray-500 mb-6">
              Our team handles custom solutions of all sizes — from large-scale technology projects to simple website designs.
            </p>
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-10">
              - Select a Technology to Learn More -
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 border rounded-lg hover:shadow-lg transition"
              >
                <div className="text-primary mb-2">{tech.icon}</div>
                <p className="text-center font-semibold">{tech.name}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition duration-300">
              See All Technologies
            </button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 mt-16 mb-16">
        <h1 className="text-center text-3xl sm:text-4xl font-bold mb-10">
          Our Services
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl transition"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Homepage
