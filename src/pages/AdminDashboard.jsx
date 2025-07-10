import React, { useEffect, useState } from 'react';
import API from '../services/api';
import '../styles/AdminDashboard.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const AdminDashboard = () => {
  const [agents, setAgents] = useState([]);
  const [properties, setProperties] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [agentPropertyStats, setAgentPropertyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animatedCounts, setAnimatedCounts] = useState({
    agents: 0,
    properties: 0,
    customers: 0
  });

  const animateCount = (key, target) => {
    let start = 0;
    const duration = 800;
    const stepTime = 100;
    const step = Math.ceil(target / (duration / stepTime));
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(interval);
      }
      setAnimatedCounts(prev => ({ ...prev, [key]: start }));
    }, stepTime);
  };

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [agentRes, propertyRes, customerRes, agentPropRes] = await Promise.all([
        API.get('/admin/agents-stats', { headers: { Authorization: `Bearer ${token}` } }),
        API.get('/admin/properties', { headers: { Authorization: `Bearer ${token}` } }),
        API.get('/admin/customers', { headers: { Authorization: `Bearer ${token}` } }),
        API.get('/admin/agent-property-count', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setAgents(agentRes.data);
      setProperties(propertyRes.data);
      setCustomers(customerRes.data);
      setAgentPropertyStats(agentPropRes.data.slice(0, 10));

      animateCount('agents', agentRes.data.length);
      animateCount('properties', propertyRes.data.length);
      animateCount('customers', customerRes.data.length);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const propertyByCity = Object.values(
    properties.reduce((acc, p) => {
      acc[p.location] = acc[p.location] || { city: p.location, count: 0 };
      acc[p.location].count++;
      return acc;
    }, {})
  );

  const customerStats = [
    {
      type: 'Accepted',
      count: customers.reduce((acc, c) => acc + (c.acceptedBookings || 0), 0)
    },
    {
      type: 'Rejected',
      count: customers.reduce((acc, c) => acc + (c.rejectedBookings || 0), 0)
    }
  ];

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="section-title">Loading admin data...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Welcome, Admin</h2>
      </div>

      <div className="summary-cards">
        <div className="summary-card gradient-blue">
          <h3>Total Agents</h3>
          <p>{animatedCounts.agents}</p>
        </div>
        <div className="summary-card gradient-green">
          <h3>Total Properties</h3>
          <p>{animatedCounts.properties}</p>
        </div>
        <div className="summary-card gradient-orange">
          <h3>Total Customers</h3>
          <p>{animatedCounts.customers}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h4>Properties by City</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={propertyByCity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4>Agents by Properties</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={agentPropertyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalProperties" fill="#2ecc71" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <section>
        <h3 className="section-title">Agents List</h3>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Status</th>
                <th># Bookings</th>
              </tr>
            </thead>
            <tbody>
              {agents.map(agent => (
                <tr key={agent._id} className="hover-highlight">
                  <td>{agent.name}</td>
                  <td>{agent.email}</td>
                  <td>{new Date(agent.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${agent.isActive ? 'status-active' : 'status-inactive'}`}>
                      {agent.isActive ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                  </td>
                  <td>{agent.totalBookings || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="section-title">Customers List</h3>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer._id} className="hover-highlight">
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${customer.isActive ? 'status-active' : 'status-inactive'}`}>
                      {customer.isActive ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="section-title">Properties List</h3>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Price</th>
                <th>Posted By</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(prop => (
                <tr key={prop._id} className="hover-highlight">
                  <td>{prop.title}</td>
                  <td>{prop.location}</td>
                  <td>₹{prop.price}</td>
                  <td>{prop.agent?.name || 'Unknown'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );    
};

export default AdminDashboard;
