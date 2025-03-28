import React, { useEffect, useState } from "react";

// API functions
const API_BASE_URL = "http://localhost:8070/api/payment";

const fetchPayments = async () => {
  const response = await fetch(API_BASE_URL);
  return response.json();
};

const updatePaymentStatus = async (id, status) => {
  const response = await fetch(`${API_BASE_URL}/status/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return response.json();
};

function PaymentAdmin() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    const data = await fetchPayments();
    if (data.success) setPayments(data.payments);
    setLoading(false);
  };

  const handleStatusChange = async (id, status) => {
    const data = await updatePaymentStatus(id, status);
    if (data.success) {
      setMessage(`✅ Payment ${status}`);
      loadPayments();
    } else {
      setMessage("❌ Error updating payment status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Payments</h1>

      {message && <p className="text-center text-lg text-green-600">{message}</p>}

      {loading ? (
        <p className="text-center">Loading payments...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Method</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-t">
                  <td className="px-4 py-2">{payment.userId}</td>
                  <td className="px-4 py-2">{payment.paymentMethod}</td>
                  <td className="px-4 py-2">${payment.amount.toFixed(2)}</td>
                  <td className="px-4 py-2 font-semibold text-blue-600">{payment.status}</td>
                  <td className="px-4 py-2 flex justify-center space-x-2">
                    {payment.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(payment._id, "Approved")}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(payment._id, "Cancelled")}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PaymentAdmin;
