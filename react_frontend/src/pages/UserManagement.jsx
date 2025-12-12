import React, { useEffect, useState } from 'react';
import { listUsers, createUser, updateUser, deleteUser } from '../services/api';

/**
 * PUBLIC_INTERFACE
 * UserManagement allows creating, viewing, editing, and deleting users.
 */
export default function UserManagement() {
  const emptyForm = { name: '', email: '', role: 'member' };
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');

  const loadUsers = async () => {
    setErr('');
    try {
      const data = await listUsers();
      setUsers(Array.isArray(data) ? data : (data?.items || []));
    } catch (e) {
      setErr(e.message || 'Failed to fetch users');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onCreate = async () => {
    setErr(''); setSuccess('');
    try {
      await createUser(form);
      setSuccess('User created');
      setForm(emptyForm);
      await loadUsers();
    } catch (e) {
      setErr(e.message || 'Create failed');
    }
  };

  const startEdit = (u) => {
    setEditingId(u.id || u._id);
    setForm({ name: u.name || '', email: u.email || '', role: u.role || 'member' });
  };

  const onUpdate = async () => {
    setErr(''); setSuccess('');
    try {
      await updateUser(editingId, form);
      setSuccess('User updated');
      setEditingId(null);
      setForm(emptyForm);
      await loadUsers();
    } catch (e) {
      setErr(e.message || 'Update failed');
    }
  };

  const onDelete = async (id) => {
    setErr(''); setSuccess('');
    try {
      await deleteUser(id);
      setSuccess('User deleted');
      await loadUsers();
    } catch (e) {
      setErr(e.message || 'Delete failed');
    }
  };

  return (
    <div className="user-mgmt">
      <h1 className="section-title">User Management</h1>
      {err && <div className="card" style={{ borderColor: 'rgba(220,38,38,0.3)' }}>{err}</div>}
      {success && <div className="card" style={{ borderColor: 'rgba(5,150,105,0.3)' }}>{success}</div>}

      <div className="grid two">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>{editingId ? 'Edit User' : 'Create User'}</h2>
          <div className="col">
            <label>Name</label>
            <input className="input" name="name" value={form.name} onChange={onChange} placeholder="Full name" />
          </div>
          <div className="col" style={{ marginTop: 8 }}>
            <label>Email</label>
            <input className="input" name="email" value={form.email} onChange={onChange} placeholder="name@example.com" />
          </div>
          <div className="col" style={{ marginTop: 8 }}>
            <label>Role</label>
            <select className="select" name="role" value={form.role} onChange={onChange}>
              <option value="member">Member</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            {editingId ? (
              <>
                <button className="btn" onClick={onUpdate}>Save</button>
                <button className="btn ghost" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>
              </>
            ) : (
              <button className="btn" onClick={onCreate}>Create</button>
            )}
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Users</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Role</th><th>ID</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="5" style={{ color: '#6B7280' }}>No users found</td></tr>
                ) : users.map(u => {
                  const id = u.id || u._id;
                  return (
                    <tr key={id || u.email}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td><code>{id || '—'}</code></td>
                      <td className="row">
                        <button className="btn ghost" onClick={() => startEdit(u)}>Edit</button>
                        <button className="btn secondary" onClick={() => onDelete(id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="row" style={{ marginTop: 8 }}>
            <button className="btn ghost" onClick={loadUsers}>Refresh</button>
          </div>
        </div>
      </div>
    </div>
  );
}
