
'use client'
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/Card';
import { Card,CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{steps[step]}</DialogTitle>
        </DialogHeader>
        <Card>
          <CardContent className="space-y-4 p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {step === 0 && (
                <>
                  <Input name="company_name" onChange={handleChange} placeholder="Company Name" />
                  <Input name="companylogo" onChange={handleChange} placeholder="Logo URL" />
                  <Input name="tagline" onChange={handleChange} placeholder="Tagline" />
                  <Input name="summary" onChange={handleChange} placeholder="Summary" />
                </>
              )}
              {step === 1 && (
                <>
                  <Input name="phone_number" onChange={handleChange} placeholder="Phone Number" />
                  <Input name="employee_count" onChange={handleChange} placeholder="Employee Count" />
                  <Input name="gstno" onChange={handleChange} placeholder="GST Number" />
                  <Input name="service_lines" onChange={handleChange} placeholder="Service Lines" />
                  <Input name="industry_focus" onChange={handleChange} placeholder="Industry Focus" />
                  <Input name="client_size" onChange={handleChange} placeholder="Client Size" />
                  <Input name="specilization" onChange={handleChange} placeholder="Specialization" />
                </>
              )}
              {step === 2 && (
                <>
                  <Input name="portfolio.title" onChange={handleChange} placeholder="Project Title" />
                  <Input name="portfolio.project_link" onChange={handleChange} placeholder="Project Link" />
                  <Input name="portfolio.project_category" onChange={handleChange} placeholder="Project Category" />
                  <Input name="portfolio.description" onChange={handleChange} placeholder="Project Description" />
                  <Input name="website.website_link" onChange={handleChange} placeholder="Website Link" />
                  <Input name="website.sales_email" onChange={handleChange} placeholder="Sales Email" />
                </>
              )}
              {step === 3 && (
                <>
                  <Input name="admin.email" onChange={handleChange} placeholder="Admin Email" />
                  <Input name="admin.admin_phone" onChange={handleChange} placeholder="Admin Phone" />
                  <Input name="admin.linkedin_url" onChange={handleChange} placeholder="LinkedIn URL" />
                  <Input name="admin.facebook_url" onChange={handleChange} placeholder="Facebook URL" />
                </>
              )}
            </motion.div>
          </CardContent>
        </Card>
        <DialogFooter className="flex justify-between pt-4">
          {step > 0 && <Button variant="outline" onClick={prevStep}>Previous</Button>}
          {step < steps.length - 1 ? (
            <Button onClick={nextStep}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white">Submit</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationProfileModal;
