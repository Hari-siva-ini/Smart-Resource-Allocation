import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repRes, volRes, taskRes] = await Promise.all([
          axios.get('http://localhost:5000/api/reports'),
          axios.get('http://localhost:5000/api/volunteers'),
          axios.get('http://localhost:5000/api/tasks')
        ]);
        setReports(repRes.data);
        setVolunteers(volRes.data);
        setTasks(taskRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div></div>;
  }

  const criticalReports = reports.filter(r => r.priority === 'High' || r.priority === 'Critical').length;
  const pendingReports = reports.filter(r => r.status === 'Pending').length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;

  // Chart Data
  const categoryCount = reports.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});
  const barData = Object.keys(categoryCount).map(k => ({ name: k, count: categoryCount[k] }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#ef4444', '#8b5cf6'];
  const pieData = Object.keys(categoryCount).map((k) => ({ name: k, value: categoryCount[k] }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">Real-time overview of platform activity</div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Activity className="text-blue-500" />} title="Total Reports" value={reports.length} />
        <StatCard icon={<AlertTriangle className="text-red-500" />} title="Critical / High" value={criticalReports} />
        <StatCard icon={<Users className="text-brand-500" />} title="Total Volunteers" value={volunteers.length} />
        <StatCard icon={<CheckCircle className="text-green-500" />} title="Completed Tasks" value={completedTasks} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Charts */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Reports by Category</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h2 className="text-lg font-bold text-gray-900 mb-4">Distribution</h2>
           <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                   {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Recent Needs Reports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600 text-sm">Location</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Category</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">AI Priority</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.slice().reverse().slice(0, 5).map(report => (
                <tr key={report.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-900">{report.location}</td>
                  <td className="p-4 text-sm text-gray-600">{report.category}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${report.priority === 'High' ? 'bg-red-100 text-red-700' : report.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                      {report.priority}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${report.status === 'Pending' ? 'bg-orange-100 text-orange-700' : report.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    {report.status === 'Pending' ? (
                      <Link to={`/match/${report.id}`} className="text-brand-600 hover:text-brand-800 font-medium text-sm">Find Match</Link>
                    ) : (
                      <span className="text-gray-400 text-sm">Assigned</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className="p-3 bg-gray-50 rounded-xl">
        {icon}
      </div>
      <div>
        <div className="text-sm text-gray-500 font-medium">{title}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
    </div>
  );
}
