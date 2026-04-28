import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CheckCircle, Clock, MapPin, Phone } from 'lucide-react';

export default function TaskTrackingPage() {
  const [tasks, setTasks] = useState([]);
  const [reports, setReports] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [taskRes, repRes, volRes] = await Promise.all([
        axios.get('http://localhost:5000/api/tasks'),
        axios.get('http://localhost:5000/api/reports'),
        axios.get('http://localhost:5000/api/volunteers')
      ]);
      setTasks(taskRes.data);
      setReports(repRes.data);
      setVolunteers(volRes.data);
    } catch (err) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/task-status/${taskId}`, { status: newStatus });
      toast.success(`Task marked as ${newStatus}`);
      fetchData(); // Refresh data
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div></div>;

  const enrichedTasks = tasks.map(t => ({
    ...t,
    report: reports.find(r => r.id === t.reportId),
    volunteer: volunteers.find(v => v.id === t.volunteerId)
  })).reverse(); // Newest first

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Task Tracking</h1>
        <div className="text-sm text-gray-500">Monitor assigned tasks and progress</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* In Progress Column */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
             <Clock className="w-5 h-5 text-orange-500" /> Active Tasks
          </h2>
          
          {enrichedTasks.filter(t => t.status !== 'Completed').map(task => (
            <div key={task.id} className="bg-white p-6 rounded-2xl shadow-sm border border-l-4 border-l-orange-400 border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-sm font-bold text-orange-600 mb-1">{task.report?.category} Need</div>
                  <h3 className="text-lg font-bold text-gray-900">{task.report?.location}</h3>
                </div>
                <div className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">
                  {task.status}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl mb-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Assigned Volunteer</div>
                  <div className="font-medium text-gray-900">{task.volunteer?.name}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-1 mt-1"><Phone className="w-3 h-3"/> {task.volunteer?.phone}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reporter Details</div>
                  <div className="font-medium text-gray-900">{task.report?.reporterName}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-1 mt-1"><Phone className="w-3 h-3"/> {task.report?.contactNumber}</div>
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={() => updateStatus(task.id, 'Completed')}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" /> Mark Completed
                </button>
              </div>
            </div>
          ))}

          {enrichedTasks.filter(t => t.status !== 'Completed').length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-500">No active tasks at the moment.</p>
            </div>
          )}
        </div>

        {/* Completed Column */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
             <CheckCircle className="w-5 h-5 text-green-500" /> Completed
          </h2>
          
          <div className="space-y-4">
            {enrichedTasks.filter(t => t.status === 'Completed').map(task => (
              <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-l-4 border-l-green-500 border-gray-100 opacity-75">
                <div className="text-sm font-bold text-green-600 mb-1">{task.report?.category} Need</div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{task.report?.location}</h3>
                <div className="text-xs text-gray-600">Vol: {task.volunteer?.name}</div>
              </div>
            ))}

            {enrichedTasks.filter(t => t.status === 'Completed').length === 0 && (
              <div className="text-center py-8 text-sm text-gray-500">
                No completed tasks yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
