import React, { useEffect, useState } from "react";
import "./PaymentAdmin.css";
import { jsPDF } from "jspdf";

// API base URL
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
    const confirm = window.confirm(`Are you sure you want to mark this as ${status}?`);
    if (!confirm) return;

    const data = await updatePaymentStatus(id, status);
    if (data.success) {
      setMessage(`✅ Payment ${status}`);
      loadPayments();
    } else {
      setMessage("❌ Error updating payment status");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Payment List", 20, 20);

    // Table Headers
    doc.setFillColor(0, 123, 255); // Set header background color (blue)
    doc.rect(20, 30, 180, 10, "F"); // Background color for the header row
    doc.setTextColor(255, 255, 255); // Set text color to white
    doc.text("Method", 20, 35);
    doc.text("Amount", 60, 35);
    doc.text("Status", 100, 35);
    doc.text("Date", 140, 35);
    doc.text("Bank", 180, 35);
    doc.text("Branch", 220, 35);

    let y = 45; // Starting y-position for table rows

    payments.forEach((payment) => {
      doc.setTextColor(0, 0, 0); // Set text color to black for rows

      doc.text(payment.paymentMethod || "-", 20, y);
      doc.text(`$${payment.amount.toFixed(2)}`, 60, y);
      doc.text(payment.status, 100, y);
      doc.text(new Date(payment.paymentDate || payment.createdAt).toLocaleDateString(), 140, y);
      doc.text(payment.bankName || "-", 180, y);
      doc.text(payment.bankBranch || "-", 220, y);

      y += 10; // Add space between rows

      if (y > 250) {
        doc.addPage();
        y = 20; // Reset y-position for the new page
      }
    });

    doc.save("payments.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Payments</h1>

      {message && <p className="text-center text-lg text-green-600 mb-4">{message}</p>}

      <button
        onClick={generatePDF}
        className="generate-pdf-btn mb-4"
      >
        Generate PDF
      </button>

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
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Bank</th>
                <th className="px-4 py-2 text-left">Branch</th>
                <th className="px-4 py-2 text-left">Slip</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-t">
                  <td className="px-4 py-2">{payment.userId?.name || "-"}</td>
                  <td className="px-4 py-2">{payment.paymentMethod}</td>
                  <td className="px-4 py-2">${payment.amount.toFixed(2)}</td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      payment.status === "Approved"
                        ? "text-green-600"
                        : payment.status === "Cancelled"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {payment.status}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{payment.bankName || "-"}</td>
                  <td className="px-4 py-2">{payment.bankBranch || "-"}</td>
                  <td className="px-4 py-2">
                    {payment.paymentMethod === "Bank Transfer" && payment.bankSlip ? (
                      <a
                        href={`http://localhost:8070/${payment.bankSlip.replace(/\\/g, "/")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View Slip
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
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
