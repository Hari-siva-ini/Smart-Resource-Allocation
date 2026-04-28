import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserCheck, MapPin, Phone, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function MatchResultsPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const { data: reports } = await axios.get('http://localhost:5000/api/reports');
        const currentReport = reports.find(r => r.id === reportId);
        
        if (currentReport) {
          setReport(currentReport);
          // Get AI matches based on category
          const { data: matchData } = await axios.post('http://localhost:5000/api/match-volunteers', {
            reportId: currentReport.id,
            category: currentReport.category
          });
          setMatches(matchData.matches);
        } else {
          toast.error("Report not found");
          navigate('/admin');
        }
      } catch (err) {
        toast.error("Failed to fetch matches");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [reportId, navigate]);

  const handleAssign = async (volunteerId) => {
    setAssigningId(volunteerId);
    try {
      await axios.post('http://localhost:5000/api/tasks', {
        reportId,
        volunteerId
      });
      toast.success('Task successfully assigned!');
      navigate('/tasks');
    } catch (err) {
      toast.error('Failed to assign task');
      setAssigningId(null);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div></div>;
  if (!report) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/admin')} className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Report Details */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-6 h-6 text-brand-500" />
              <h2 className="text-lg font-bold text-gray-900">Need Report</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Category</div>
                <div className="font-medium text-gray-900">{report.category}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Location</div>
                <div className="font-medium text-gray-900 flex items-start gap-1">
                  <MapPin className="w-4 h-4 mt-0.5 text-gray-400" /> {report.location}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Description</div>
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mt-1">{report.description}</div>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                 <div className="text-sm text-gray-500">AI Priority Score</div>
                 <div className={`px-3 py-1 rounded-full text-sm font-bold ${report.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                   {report.priority}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Matches */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Suggested Volunteers
            <span className="text-sm font-normal text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">AI Matched</span>
          </h2>

          <div className="space-y-4">
            {matches.map((volunteer, index) => (
              <div key={volunteer.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{volunteer.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><UserCheck className="w-4 h-4" /> {volunteer.skill}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {volunteer.distance}</span>
                      <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {volunteer.phone}</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 bg-gray-50 inline-block px-2 py-1 rounded">
                      Availability: {volunteer.availability}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-500">Match Score</div>
                    <div className="text-lg font-bold text-green-600">{volunteer.score}%</div>
                  </div>
                  <button 
                    onClick={() => handleAssign(volunteer.id)}
                    disabled={assigningId === volunteer.id}
                    className="w-full sm:w-auto px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors disabled:opacity-70"
                  >
                    {assigningId === volunteer.id ? 'Assigning...' : 'Assign Task'}
                  </button>
                </div>
              </div>
            ))}

            {matches.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500">No suitable volunteers found nearby for this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
