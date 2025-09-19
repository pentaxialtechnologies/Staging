
'use client'
import React, { useState } from 'react';
import { Inputs } from '@/components/ui/Inputs';
import { Buttons } from '@/components/ui/Buttons';
import { Cards, CardContents } from '@/components/ui/Cards';
import { motion } from 'framer-motion';
import {
  Dialogs,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/Dialogs';

const steps = ['Company Info', 'Company Specs', 'Portfolio & Website', 'Admin Info'];

const OrganizationProfileModal = () => {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    company_name: '',
    companylogo: '',
    tagline: '',
    summary: '',
    company_location: '',
    location: { city: '', state: '', country: '' },
    phone_number: '',
    employee_count: '',
    gstno: '',
    service_lines: '',
    industry_focus: '',
    client_size: '',
    specilization: '',
    min_project_size: '',
    hourly_rate: '',
    size_of_company: '',
    company_founded: '',
    skills: [],
    portfolio: {
      title: '',
      thumbnail: '',
      project_link: '',
      project_category: '',
      timeline: '',
      project_cost: '',
      screenshot: '',
      description: ''
    },
    admin: {
      email: '',
      admin_phone: '',
      linkedin_url: '',
      facebook_url: '',
      twitter_url: '',
      google_analytics_id: ''
    },
    website: { website_link: '', sales_email: '' }
  });

const handleChange= (e:React.ChangeEvent<HTMLInputElement>)=>{
    const {name,value} = e.target;
    setFormData((prev)=>{
        const [section,key] = name.split('.') as [keyof typeof formData,string]
        const sectiondata = prev[section]
        if(typeof sectiondata === 'object' && sectiondata !== null){
            return {
                ...prev,
                [section]:{
                    ...sectiondata,
                    [key]: value
                }
            }
        }
        return {
            ...prev,
            [name]: value
        }
    })
   

}

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    const res = await fetch('/api/organization/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const result = await res.json();
    alert(result.message);
  };

  return (
    <Dialogs open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{steps[step]}</DialogTitle>
        </DialogHeader>
        <Cards>
          <CardContents className="space-y-4 p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {step === 0 && (
                <>
                  <Inputs name="company_name" onChange={handleChange} placeholder="Company Name" />
                  <Inputs name="companylogo" onChange={handleChange} placeholder="Logo URL" />
                  <Inputs name="tagline" onChange={handleChange} placeholder="Tagline" />
                  <Inputs name="summary" onChange={handleChange} placeholder="Summary" />
                </>
              )}
              {step === 1 && (
                <>
                  <Inputs name="phone_number" onChange={handleChange} placeholder="Phone Number" />
                  <Inputs name="employee_count" onChange={handleChange} placeholder="Employee Count" />
                  <Inputs name="gstno" onChange={handleChange} placeholder="GST Number" />
                  <Inputs name="service_lines" onChange={handleChange} placeholder="Service Lines" />
                  <Inputs name="industry_focus" onChange={handleChange} placeholder="Industry Focus" />
                  <Inputs name="client_size" onChange={handleChange} placeholder="Client Size" />
                  <Inputs name="specilization" onChange={handleChange} placeholder="Specialization" />
                </>
              )}
              {step === 2 && (
                <>
                  <Inputs name="portfolio.title" onChange={handleChange} placeholder="Project Title" />
                  <Inputs name="portfolio.project_link" onChange={handleChange} placeholder="Project Link" />
                  <Inputs name="portfolio.project_category" onChange={handleChange} placeholder="Project Category" />
                  <Inputs name="portfolio.description" onChange={handleChange} placeholder="Project Description" />
                  <Inputs name="website.website_link" onChange={handleChange} placeholder="Website Link" />
                  <Inputs name="website.sales_email" onChange={handleChange} placeholder="Sales Email" />
                </>
              )}
              {step === 3 && (
                <>
                  <Inputs name="admin.email" onChange={handleChange} placeholder="Admin Email" />
                  <Inputs name="admin.admin_phone" onChange={handleChange} placeholder="Admin Phone" />
                  <Inputs name="admin.linkedin_url" onChange={handleChange} placeholder="LinkedIn URL" />
                  <Inputs name="admin.facebook_url" onChange={handleChange} placeholder="Facebook URL" />
                </>
              )}
            </motion.div>
          </CardContents>
        </Cards>
        <DialogFooter className="flex justify-between pt-4">
          {step > 0 && <Buttons variant="outline" onClick={prevStep}>Previous</Buttons>}
          {step < steps.length - 1 ? (
            <Buttons onClick={nextStep}>Next</Buttons>
          ) : (
            <Buttons onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white">Submit</Buttons>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialogs>
  );
};

export default OrganizationProfileModal;
