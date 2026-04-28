import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { AlertCircle, FileText, CheckCircle, Clock } from 'lucide-react';

export default function ReporterDashboard() {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    location: '',
    category: 'Medical',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Medical', 'Food', 'Flood', 'Blood', 'Education', 'Rescue', 'Other'];

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'reports'), where('reporterUid', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'reports'), {
        ...formData,
        reporterUid: currentUser.uid,
        reporterName: currentUser.email, // Or fetch fullName from users collection
        status: 'Pending',
        priority: 'Unassigned', // AI function will update this
        createdAt: serverTimestamp(),
      });
      toast.success('Report submitted successfully!');
      setFormData({ location: '', category: 'Medical', description: '' });
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to submit report: ' + error.message);
    }
    setSubmitting(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reporter Dashboard</h1>
          <p className="text-sm text-gray-500">Manage your submitted reports and track their status</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-brand-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-brand-600 transition-colors shadow-sm"
        >
          {showForm ? 'Cancel Form' : '+ Submit New Report'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="bg-brand-500 px-8 py-6 text-black flex items-center gap-3">
            <AlertCircle className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">Submit Need Report</h2>
              <p className="text-black/80 text-sm mt-1">Report an emergency or a community need.</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Location / Address</label>
                 <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                   placeholder="E.g., 123 Main St"
                   value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                 <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                   value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                   {categories.map(cat => <option key={cat}>{cat}</option>)}
                 </select>
               </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea required rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                placeholder="Describe the situation..."
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>
            <button disabled={submitting} type="submit" className="w-full bg-brand-500 hover:bg-brand-600 text-black font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-70">
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-900 mb-4">My Submitted Reports</h2>
      {reports.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
          No reports submitted yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.sort((a,b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()).map(report => (
            <div key={report.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                  {report.category}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                  report.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                  report.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                  'bg-orange-100 text-orange-700'
                }`}>
                  {report.status === 'Completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {report.status || 'Pending'}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 truncate" title={report.location}>{report.location}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{report.description}</p>
              <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-500">
                 <span>Priority: {report.priority || 'Analyzing...'}</span>
                 <span>{report.createdAt ? new Date(report.createdAt.toMillis()).toLocaleDateString() : 'Just now'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
