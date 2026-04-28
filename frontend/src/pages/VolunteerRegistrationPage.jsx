import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

export default function VolunteerRegistrationPage() {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', city: '',
    skills: [], languages: '', availability: 'Weekend',
    vehicle: 'No', experience: ''
  });
  const [loading, setLoading] = useState(false);

  const skillOptions = ['Medical', 'Driver', 'Teacher', 'Rescue', 'Food Delivery', 'Technical', 'General'];

  const handleSkillToggle = (skill) => {
    setFormData(prev => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.skills.length === 0) {
        return toast.error("Please select at least one skill");
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/volunteers', formData);
      toast.success('Successfully registered as a volunteer!');
      setFormData({
        name: '', phone: '', email: '', city: '',
        skills: [], languages: '', availability: 'Weekend',
        vehicle: 'No', experience: ''
      });
    } catch (err) {
      toast.error('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-brand-500 px-8 py-6 text-white flex items-center gap-3">
          <UserPlus className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Volunteer Registration</h1>
            <p className="text-brand-100 text-sm mt-1">Join our network to help the community in times of need.</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input required type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input required type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City / Area</label>
              <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Skills</label>
            <div className="flex flex-wrap gap-3">
              {skillOptions.map(skill => (
                <button type="button" key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${formData.skills.includes(skill) ? 'bg-brand-50 border-brand-500 text-brand-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Languages (comma separated)</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.languages} onChange={e => setFormData({...formData, languages: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})}>
                <option>Full Time</option>
                <option>Weekend</option>
                <option>Emergency Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Available</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.vehicle} onChange={e => setFormData({...formData, vehicle: e.target.value})}>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience / Notes</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button disabled={loading} type="submit" className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center">
              {loading ? 'Submitting...' : 'Complete Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
