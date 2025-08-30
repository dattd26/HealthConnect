import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import LoadingSpinner from '../Components/common/LoadingSpinner';
import Toast from '../Components/common/Toast';
import '../styles/AdminDashboard.css';

const AdminDashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [doctorRequests, setDoctorRequests] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    useEffect(() => {
        // Kiểm tra quyền admin
        if (!user || user.role !== 'ADMIN') {
            navigate('/');
            return;
        }

        loadDashboardData();
    }, [user, navigate]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [statsData, requestsData, specialtiesData, usersData] = await Promise.all([
                adminService.getDashboardStats(),
                adminService.getPendingDoctorRequests(),
                adminService.getAllSpecialties(),
                adminService.getAllUsers()
            ]);

            setStats(statsData);
            setDoctorRequests(requestsData);
            setSpecialties(specialtiesData);
            setUsers(usersData);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            showToast('Lỗi khi tải dữ liệu dashboard', 'error');
        } finally {
            setLoading(false);
        }
    };

    const triggerToast = (message, type = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };
    

    const handleApproveDoctor = async (requestId) => {
        try {
            await adminService.approveDoctorRequest(requestId);
            triggerToast('Đã phê duyệt yêu cầu đăng ký bác sĩ');
            loadDashboardData(); // Reload data
        } catch (error) {
            triggerToast('Lỗi khi phê duyệt yêu cầu', 'error');
        }
    };

    const handleRejectDoctor = async (requestId, reason) => {
        if (!reason || reason.trim() === '') {
            triggerToast('Vui lòng nhập lý do từ chối', 'error');
            return;
        }

        try {
            await adminService.rejectDoctorRequest(requestId, reason);
            triggerToast('Đã từ chối yêu cầu đăng ký bác sĩ');
            loadDashboardData();
        } catch (error) {
            triggerToast('Lỗi khi từ chối yêu cầu', 'error');
        }
    };

    const handleCreateSpecialty = async (formData) => {
        try {
            await adminService.createSpecialty(formData);
            triggerToast('Đã tạo chuyên khoa mới');
            loadDashboardData();
        } catch (error) {
            triggerToast('Lỗi khi tạo chuyên khoa', 'error');
        }
    };

    const handleUpdateUserRole = async (userId, newRole) => {
        try {
            await adminService.updateUserRole(userId, newRole);
            triggerToast('Đã cập nhật vai trò người dùng');
            loadDashboardData();
        } catch (error) {
            triggerToast('Lỗi khi cập nhật vai trò', 'error');
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Quản lý hệ thống HealthConnect</p>
            </div>

            <div className="admin-tabs">
                <button 
                    className={`admin-tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    Tổng quan
                </button>
                <button 
                    className={`admin-tab-button ${activeTab === 'doctor-requests' ? 'active' : ''}`}
                    onClick={() => setActiveTab('doctor-requests')}
                >
                    Yêu cầu đăng ký bác sĩ ({doctorRequests.length})
                </button>
                <button 
                    className={`admin-tab-button ${activeTab === 'specialties' ? 'active' : ''}`}
                    onClick={() => setActiveTab('specialties')}
                >
                    Chuyên khoa ({specialties.length})
                </button>
                <button 
                    className={`admin-tab-button ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Người dùng ({users.length})
                </button>
            </div>

            <div className="admin-content">
                {activeTab === 'dashboard' && (
                    <DashboardOverview stats={stats} />
                )}

                {activeTab === 'doctor-requests' && (
                    <DoctorRequestsSection 
                        requests={doctorRequests}
                        onApprove={handleApproveDoctor}
                        onReject={handleRejectDoctor}
                    />
                )}

                {activeTab === 'specialties' && (
                    <SpecialtiesSection 
                        specialties={specialties}
                        onCreate={handleCreateSpecialty}
                    />
                )}

                {activeTab === 'users' && (
                    <UsersSection 
                        users={users}
                        onUpdateRole={handleUpdateUserRole}
                    />
                )}
            </div>

            {showToast && (
                <Toast 
                    message={toastMessage} 
                    type={toastType} 
                    onClose={() => setShowToast(false)} 
                />
            )}
        </div>
    );
};

// Dashboard Overview Component
const DashboardOverview = ({ stats }) => {
    if (!stats) return <div>Không có dữ liệu</div>;

    return (
        <div className="admin-dashboard-overview">
            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <h3>Tổng người dùng</h3>
                    <p className="admin-stat-number">{stats.totalUsers}</p>
                </div>
                <div className="admin-stat-card">
                    <h3>Bác sĩ</h3>
                    <p className="admin-stat-number">{stats.totalDoctors}</p>
                </div>
                <div className="admin-stat-card">
                    <h3>Bệnh nhân</h3>
                    <p className="admin-stat-number">{stats.totalPatients}</p>
                </div>
                <div className="admin-stat-card">
                    <h3>Yêu cầu chờ duyệt</h3>
                    <p className="admin-stat-number warning">{stats.pendingDoctorRequests}</p>
                </div>
                <div className="admin-stat-card">
                    <h3>Chuyên khoa</h3>
                    <p className="admin-stat-number">{stats.totalSpecialties}</p>
                </div>
                <div className="admin-stat-card">
                    <h3>Người dùng đã xác thực</h3>
                    <p className="admin-stat-number success">{stats.verifiedUsers}</p>
                </div>
            </div>
        </div>
    );
};

// Doctor Requests Section Component
const DoctorRequestsSection = ({ requests, onApprove, onReject }) => {
    const [rejectReasons, setRejectReasons] = useState({});

    const handleReject = (requestId) => {
        const reason = rejectReasons[requestId];
        if (reason && reason.trim() !== '') {
            onReject(requestId, reason);
            setRejectReasons(prev => ({ ...prev, [requestId]: '' }));
        }
    };

    if (requests.length === 0) {
        return <div className="admin-empty-state">Không có yêu cầu đăng ký nào đang chờ</div>;
    }

    return (
        <div className="admin-doctor-requests-section">
            <h2>Yêu cầu đăng ký bác sĩ đang chờ</h2>
            <div className="admin-requests-grid">
                {requests.map((request) => (
                    <div key={request.id} className="admin-request-card">
                        <div className="admin-request-header">
                            <h3>{request.fullName}</h3>
                            <span className="admin-status pending">Chờ duyệt</span>
                        </div>
                        <div className="admin-request-details">
                            <p><strong>Username:</strong> {request.username}</p>
                            <p><strong>Email:</strong> {request.email}</p>
                            <p><strong>Số điện thoại:</strong> {request.phone}</p>
                            <p><strong>Giấy phép:</strong> {request.license}</p>
                            <p><strong>Bệnh viện:</strong> {request.hospital}</p>
                        </div>
                        <div className="admin-request-actions">
                            <button 
                                className="admin-btn-approve"
                                onClick={() => onApprove(request.id)}
                            >
                                Phê duyệt
                            </button>
                            <div className="admin-reject-section">
                                <input
                                    type="text"
                                    placeholder="Lý do từ chối"
                                    value={rejectReasons[request.id] || ''}
                                    onChange={(e) => setRejectReasons(prev => ({
                                        ...prev,
                                        [request.id]: e.target.value
                                    }))}
                                />
                                <button 
                                    className="admin-btn-reject"
                                    onClick={() => handleReject(request.id)}
                                >
                                    Từ chối
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Specialties Section Component
const SpecialtiesSection = ({ specialties, onCreate }) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newSpecialty, setNewSpecialty] = useState({ name: '', description: '', code: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newSpecialty.name && newSpecialty.description && newSpecialty.code) {
            onCreate(newSpecialty);
            setNewSpecialty({ name: '', description: '', code: '' });
            setShowCreateForm(false);
        }
    };

    return (
        <div className="admin-specialties-section">
            <div className="admin-section-header">
                <h2>Quản lý chuyên khoa</h2>
                <button 
                    className="admin-btn-primary"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? 'Hủy' : 'Thêm chuyên khoa'}
                </button>
            </div>

            {showCreateForm && (
                <form className="admin-create-specialty-form" onSubmit={handleSubmit}>
                    <div className="admin-form-group">
                        <label>Tên chuyên khoa:</label>
                        <input
                            type="text"
                            value={newSpecialty.name}
                            onChange={(e) => setNewSpecialty(prev => ({ ...prev, name: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="admin-form-group">
                        <label>Mô tả:</label>
                        <textarea
                            value={newSpecialty.description}
                            onChange={(e) => setNewSpecialty(prev => ({ ...prev, description: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="admin-form-group">
                        <label>Mã chuyên khoa:</label>
                        <input
                            type="text"
                            value={newSpecialty.code}
                            onChange={(e) => setNewSpecialty(prev => ({ ...prev, code: e.target.value }))}
                            required
                        />
                    </div>
                    <button type="submit" className="admin-btn-primary">Tạo chuyên khoa</button>
                </form>
            )}

            <div className="admin-specialties-grid">
                {specialties.map((specialty) => (
                    <div key={specialty.id} className="admin-specialty-card">
                        <h3>{specialty.name}</h3>
                        <p><strong>Mã:</strong> {specialty.code}</p>
                        <p>{specialty.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Users Section Component
const UsersSection = ({ users, onUpdateRole }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState('');

    const handleRoleUpdate = (userId) => {
        if (newRole && newRole !== selectedUser.role) {
            onUpdateRole(userId, newRole);
            setSelectedUser(null);
            setNewRole('');
        }
    };

    return (
        <div className="admin-users-section">
            <h2>Quản lý người dùng</h2>
            <div className="admin-users-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ tên</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.fullName}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`admin-role-badge ${user.role.toLowerCase()}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={`admin-status-badge ${user.verified ? 'verified' : 'pending'}`}>
                                        {user.verified ? 'Đã xác thực' : 'Chờ xác thực'}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        className="admin-btn-small"
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        Cập nhật vai trò
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedUser && (
                <div className="admin-role-update-modal">
                    <div className="admin-modal-content">
                        <h3>Cập nhật vai trò cho {selectedUser.fullName}</h3>
                        <p>Vai trò hiện tại: <strong>{selectedUser.role}</strong></p>
                        <select 
                            value={newRole} 
                            onChange={(e) => setNewRole(e.target.value)}
                        >
                            <option value="">Chọn vai trò mới</option>
                            <option value="PATIENT">PATIENT</option>
                            <option value="DOCTOR">DOCTOR</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                        <div className="admin-modal-actions">
                            <button 
                                className="admin-btn-primary"
                                onClick={() => handleRoleUpdate(selectedUser.id)}
                                disabled={!newRole || newRole === selectedUser.role}
                            >
                                Cập nhật
                            </button>
                            <button 
                                className="admin-btn-secondary"
                                onClick={() => {
                                    setSelectedUser(null);
                                    setNewRole('');
                                }}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;
