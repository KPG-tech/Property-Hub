import React, { useState } from "react";
import banks from "../../../data/banks.json";
import branches from "../../../data/branches.json";
import "./BankSlipUpload.css";

function BankSlipUploadPage() {
  const [bankSlip, setBankSlip] = useState(null);
  const [bankHolder, setBankHolder] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [message, setMessage] = useState("");
  const [filteredBranches, setFilteredBranches] = useState([]);

  const today = new Date().toISOString().split("T")[0];
  const sortedBanks = [...banks].sort((a, b) => a.name.localeCompare(b.name));

  const handleBankSlipUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBankSlip(file);
      setMessage("✅ Bank slip uploaded successfully!");
    }
  };

  const handleBankNameChange = (e) => {
    const selectedBankID = e.target.value;
    setBankName(selectedBankID);

    // Convert to string key to match JSON structure
    const filtered = branches[selectedBankID] || [];
    const sortedBranches = [...filtered].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setFilteredBranches(sortedBranches);
    setBankBranch(""); // reset previous branch
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!bankHolder || !bankName || !bankBranch || !paymentDate || !bankSlip) {
      setMessage("❌ Please fill in all fields and upload a bank slip.");
      return;
    }

    if (paymentDate > today) {
      setMessage("❌ Payment date cannot be in the future.");
      return;
    }

    setMessage("✅ Bank details and slip submitted successfully!");
    // Submit to server logic goes here
  };

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
          <select
            id="bankName"
            value={bankName}
            onChange={handleBankNameChange}
          >
            <option value="">-- Select a Bank --</option>
            {sortedBanks.map((bank) => (
              <option key={bank.ID} value={bank.ID}>
                {bank.name}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="bankBranch">Bank Branch</label>
          <select
            id="bankBranch"
            value={bankBranch}
            onChange={(e) => setBankBranch(e.target.value)}
            disabled={!filteredBranches.length}
          >
            <option value="">-- Select a Branch --</option>
            {filteredBranches.map((branch) => (
              <option key={branch.code} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="paymentDate">Payment Date</label>
          <input
            id="paymentDate"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            max={today}
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
