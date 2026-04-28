import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AlertCircle, FileText } from 'lucide-react';

export default function ReportSubmissionPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    reporterName: '', contactNumber: '', location: '',
    category: 'Medical', description: '', peopleAffected: '',
    urgency: 'Medium'
  });
  const [loading, setLoading] = useState(false);

  const categories = ['Medical', 'Food', 'Flood', 'Blood', 'Education', 'Rescue', 'Other'];
  const urgencies = ['Low', 'Medium', 'High', 'Critical'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Analyze with Gemini AI
      toast.success('Analyzing report with AI...', { icon: '🤖' });
      const { data: aiData } = await axios.post('http://localhost:5000/api/analyze-report', {
        description: formData.description,
        category: formData.category
      });

      // Merge AI-extracted fields with form data and store via AI service
      const reportPayload = {
        ...aiData,
        name: formData.reporterName,
        contact: formData.contactNumber,
        location: formData.location || aiData.location,
        category: formData.category || aiData.category,
        description: formData.description,
        peopleAffected: formData.peopleAffected,
      };

      await axios.post('http://localhost:8000/api/store-report', reportPayload);

      toast.success('Report analyzed and submitted!');
      navigate('/admin');
    } catch (err) {
      toast.error('Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-red-500 px-8 py-6 text-white flex items-center gap-3">
          <AlertCircle className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Submit Need Report</h1>
            <p className="text-red-100 text-sm mt-1">Report an emergency or a community need to get volunteer assistance.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                value={formData.reporterName} onChange={e => setFormData({...formData, reporterName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
              <input required type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Precise Location / Address</label>
            <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="E.g., 123 Main St, near Apollo Hospital, Chennai"
              value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                {categories.map(cat => <option key={cat}>{cat}</option>)}
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">People Affected</label>
              <input type="number" min="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                value={formData.peopleAffected} onChange={e => setFormData({...formData, peopleAffected: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description of Need</label>
            <textarea required rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none"
              placeholder="Describe the situation and what kind of help is exactly needed..."
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>

          {/* Photo upload mock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer transition-colors">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-500">Click to upload or drag and drop</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
             <button disabled={loading} type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center">
              {loading ? 'Processing...' : 'Submit Emergency Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
