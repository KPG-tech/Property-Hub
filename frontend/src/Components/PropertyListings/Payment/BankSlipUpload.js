import React, { useState } from "react";
import "./payment.css";

function BankSlipUploadPage() {
  const [bankSlip, setBankSlip] = useState(null);
  const [bankHolder, setBankHolder] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [message, setMessage] = useState("");

  const handleBankSlipUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBankSlip(file);
      setMessage("✅ Bank slip uploaded successfully!");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Validation for form fields
    if (!bankHolder || !bankName || !bankBranch || !paymentDate || !bankSlip) {
      setMessage("❌ Please fill in all fields and upload a bank slip.");
      return;
    }

    // Get today's date
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Validate payment date (not in the future)
    if (paymentDate > today) {
      setMessage("❌ Payment date cannot be in the future.");
      return;
    }

    setMessage("✅ Bank details and slip submitted successfully!");
    // Here you can send the form data (bank details and file) to the server or handle it as required.
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="payment-container">
      <h1 className="payment-heading">Upload Bank Slip</h1>
      <form onSubmit={handleFormSubmit} className="payment-form">
        <div className="input-group">
          <label htmlFor="bankHolder">Bank Account Holder</label>
          <input
            id="bankHolder"
            type="text"
            value={bankHolder}
            onChange={(e) => setBankHolder(e.target.value)}
            placeholder="Enter bank account holder name"
          />
        </div>

        <div className="input-group">
          <label htmlFor="bankName">Bank Name</label>
          <input
            id="bankName"
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="Enter bank name"
          />
        </div>

        <div className="input-group">
          <label htmlFor="bankBranch">Bank Branch</label>
          <input
            id="bankBranch"
            type="text"
            value={bankBranch}
            onChange={(e) => setBankBranch(e.target.value)}
            placeholder="Enter bank branch"
          />
        </div>

        <div className="input-group">
          <label htmlFor="paymentDate">Payment Date</label>
          <input
            id="paymentDate"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            max={today} // Disable future dates
          />
        </div>

        <div className="input-group">
          <label htmlFor="bankSlip">Upload Bank Slip</label>
          <input
            id="bankSlip"
            type="file"
            accept="image/*,application/pdf"
            onChange={handleBankSlipUpload}
          />
          {bankSlip && <p>File Name: {bankSlip.name}</p>}
        </div>

        <button type="submit">Submit</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default BankSlipUploadPage;
