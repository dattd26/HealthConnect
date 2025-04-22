import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Calendar, Clock, Download, CreditCard, DollarSign } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';

const Payments = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('all');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/api/payments/user/${user.id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });
        setTransactions(response.data);
        
        // Extract unique payment methods
        const methods = [...new Set(response.data.map(t => t.paymentMethod))];
        setPaymentMethods(methods);
      } catch (error) {
        setError("Đã xảy ra lỗi khi tải lịch sử giao dịch: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  const handleViewInvoice = (transaction) => {
    setSelectedInvoice(transaction);
  };

  const handleCloseInvoice = () => {
    setSelectedInvoice(null);
  };

  const handleDownloadInvoice = (transactionId) => {
    // Implementation for downloading the invoice as PDF
    console.log("Downloading invoice:", transactionId);
  };

  const handleAddPaymentMethod = () => {
    // Implementation for adding a new payment method
    console.log("Adding new payment method");
  };

  // Filter transactions based on date range
  const getFilteredTransactions = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 60)); // Already subtracted 30, so just 60 more
    const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1)); // Reset to 1 year ago
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.transactionDate);
      
      switch (dateRange) {
        case '30days':
          return transactionDate >= thirtyDaysAgo;
        case '90days':
          return transactionDate >= ninetyDaysAgo;
        case '1year':
          return transactionDate >= oneYearAgo;
        default:
          return true;
      }
    });
  };

  const filteredTransactions = getFilteredTransactions();

  // Format currency (VND)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Thanh toán và hóa đơn</h2>
      
      {/* Payment Methods */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-gray-800">Phương thức thanh toán</h3>
          <button 
            onClick={handleAddPaymentMethod}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Thêm mới
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4 flex items-center">
                {method.includes('VISA') && <CreditCard className="text-blue-600 w-8 h-8 mr-3" />}
                {method.includes('CASH') && <DollarSign className="text-green-600 w-8 h-8 mr-3" />}
                {!method.includes('VISA') && !method.includes('CASH') && <CreditCard className="text-gray-600 w-8 h-8 mr-3" />}
                <div>
                  <p className="font-medium">{method}</p>
                  {method.includes('CARD') && (
                    <p className="text-sm text-gray-500">**** **** **** 1234</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-6 bg-gray-50 rounded-md">
              <p className="text-gray-500">Chưa có phương thức thanh toán nào</p>
              <button 
                onClick={handleAddPaymentMethod}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              >
                Thêm phương thức thanh toán
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Transactions History */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">Lịch sử giao dịch</h3>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả</option>
            <option value="30days">30 ngày qua</option>
            <option value="90days">90 ngày qua</option>
            <option value="1year">1 năm qua</option>
          </select>
        </div>
        
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">Không có giao dịch nào trong khoảng thời gian này</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50 text-gray-600 text-sm">
                <tr>
                  <th className="py-3 px-4 text-left">Ngày</th>
                  <th className="py-3 px-4 text-left">Mô tả</th>
                  <th className="py-3 px-4 text-right">Số tiền</th>
                  <th className="py-3 px-4 text-right">Phương thức</th>
                  <th className="py-3 px-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {new Date(transaction.transactionDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3 px-4">
                      {transaction.description}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {transaction.paymentMethod}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleViewInvoice(transaction)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Xem
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(transaction.id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <Download className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Chi tiết hóa đơn</h2>
                <button
                  onClick={handleCloseInvoice}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              
              <div className="mb-6 flex justify-between">
                <div>
                  <p className="text-gray-500">Mã hóa đơn</p>
                  <p className="font-medium">{selectedInvoice.invoiceNumber || `INV-${selectedInvoice.id}`}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Ngày thanh toán</p>
                  <p className="font-medium">
                    {new Date(selectedInvoice.transactionDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h3 className="font-medium mb-2">Thông tin khách hàng</h3>
                <p>{user.fullName}</p>
                <p>{user.email}</p>
                <p>{user.phone}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Chi tiết dịch vụ</h3>
                <table className="w-full">
                  <thead className="text-left text-gray-600 text-sm">
                    <tr className="border-b">
                      <th className="py-2">Dịch vụ</th>
                      <th className="py-2 text-right">Đơn giá</th>
                      <th className="py-2 text-right">Số lượng</th>
                      <th className="py-2 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items ? (
                      selectedInvoice.items.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{item.serviceName}</td>
                          <td className="py-2 text-right">{formatCurrency(item.price)}</td>
                          <td className="py-2 text-right">{item.quantity}</td>
                          <td className="py-2 text-right">{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-b">
                        <td className="py-2">{selectedInvoice.description}</td>
                        <td className="py-2 text-right">{formatCurrency(selectedInvoice.amount)}</td>
                        <td className="py-2 text-right">1</td>
                        <td className="py-2 text-right">{formatCurrency(selectedInvoice.amount)}</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="font-medium">
                      <td colSpan="3" className="py-2 text-right">Tổng cộng:</td>
                      <td className="py-2 text-right">{formatCurrency(selectedInvoice.amount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h3 className="font-medium mb-2">Phương thức thanh toán</h3>
                <p>{selectedInvoice.paymentMethod}</p>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => handleDownloadInvoice(selectedInvoice.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Tải xuống PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments; 