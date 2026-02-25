import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useOrder } from "../context/OrderContext";
import {
  Package,
  User,
  MapPin,
  LogOut,
  Edit2,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  CreditCard,
  Loader2,
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

const UserProfile = () => {
  const { user, logout } = useAuth();
  const { getUserOrders } = useOrder();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [activeTab, setActiveTab] = useState("orders");
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [cards, setCards] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [loadingCards, setLoadingCards] = useState(false);
  const [submittingCard, setSubmittingCard] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "",
    email: "",
    mobile: ""
  });

  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    zip: "",
    state: "",
  });

  const [newCard, setNewCard] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

    // --- INITIALIZATION ---
  useEffect(() => {
    if (!user) return navigate("/");

    // Load profile data from logged-in user
    setProfileData({
      firstName: user.name || "",
      email: user.email || "",
      mobile: user.phone || "",
      profilePic: user.avatar || null,
    });

    // Load addresses from backend
    fetchAddresses();

    // Load orders from backend
    fetchOrders();

    // Load payment cards from backend
    fetchPaymentCards();
  }, [user, navigate]);

  // Fetch addresses from backend
  const fetchAddresses = async () => {
    try {
      const authToken = sessionStorage.getItem("authToken");
      if (!authToken) return;

      const response = await fetch("http://localhost:5000/api/auth/addresses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.addresses)) {
        setAddresses(data.addresses);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const authToken = sessionStorage.getItem("authToken");
      if (!authToken) return;

      const response = await fetch("http://localhost:5000/api/orders/my-orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  const fetchPaymentCards = async () => {
    try {
      setLoadingCards(true);
      const authToken = sessionStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/payment-cards", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCards(data.cards || []);
      } else {
        // If backend doesn't have cards yet, keep empty array
        setCards([]);
      }
    } catch (error) {
      console.error("Error fetching payment cards:", error);
      setCards([]);
    } finally {
      setLoadingCards(false);
    }
  };

  // Add new payment card
  const handleAddCard = async () => {
    if (
      !newCard.cardNumber ||
      !newCard.cardHolder ||
      !newCard.expiryMonth ||
      !newCard.expiryYear ||
      !newCard.cvv
    ) {
      return addNotification("Please fill all card details", "error");
    }

    // Validate card number (basic check - 13-19 digits)
    if (!/^\d{13,19}$/.test(newCard.cardNumber.replace(/\s/g, ""))) {
      return addNotification("Please enter a valid card number", "error");
    }

    // Validate CVV (3-4 digits)
    if (!/^\d{3,4}$/.test(newCard.cvv)) {
      return addNotification("Please enter a valid CVV", "error");
    }

    try {
      setSubmittingCard(true);
      const authToken = sessionStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/payment-cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          cardNumber: newCard.cardNumber.replace(/\s/g, ""),
          cardHolder: newCard.cardHolder,
          expiryMonth: newCard.expiryMonth,
          expiryYear: newCard.expiryYear,
          cvv: newCard.cvv,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setCards([...cards, data.card]);
        setNewCard({
          cardNumber: "",
          cardHolder: "",
          expiryMonth: "",
          expiryYear: "",
          cvv: "",
        });
        setShowAddCard(false);
        addNotification("Card added successfully", "success");
      } else {
        addNotification(data.message || "Error adding card", "error");
      }
    } catch (error) {
      console.error("Error adding card:", error);
      addNotification("Error adding card", "error");
    } finally {
      setSubmittingCard(false);
    }
  };

  // Delete payment card
  const handleDeleteCard = async (cardId) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      try {
        setSubmittingCard(true);
        const authToken = sessionStorage.getItem("authToken");
        const response = await fetch(
          `http://localhost:5000/api/payment-cards/${cardId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setCards(cards.filter((c) => c._id !== cardId));
          addNotification("Card deleted successfully", "success");
        } else {
          addNotification(data.message || "Error deleting card", "error");
        }
      } catch (error) {
        console.error("Error deleting card:", error);
        addNotification("Error deleting card", "error");
      } finally {
        setSubmittingCard(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // --- HANDLERS ---
  const handleSave = async () => {
    try {
      const authToken = sessionStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: profileData.firstName,
          email: profileData.email,
          phone: profileData.mobile,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsEditing(false);
        addNotification("Profile updated successfully", "success");
      } else {
        addNotification(data.message || "Error updating profile", "error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      addNotification("Error updating profile", "error");
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.street || !newAddress.city) {
      addNotification("Please fill all required fields", "error");
      return;
    }

    try {
      const authToken = sessionStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/auth/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          fullName: profileData.name || user?.name,
          phone: profileData.mobile || user?.phone,
          street: newAddress.street,
          address: newAddress.street,
          city: newAddress.city,
          state: newAddress.state,
          zipCode: newAddress.zip,
          country: "India",
          isDefault: addresses.length === 0,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAddresses(data.addresses);
        setNewAddress({ street: "", city: "", zip: "", state: "" });
        setShowAddAddress(false);
        addNotification("Address added successfully", "success");
      } else {
        addNotification(data.message || "Error adding address", "error");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      addNotification("Error adding address", "error");
    }
  };

  const removeAddress = async (id) => {
    try {
      const authToken = sessionStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:5000/api/auth/addresses/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setAddresses(data.addresses);
        addNotification("Address deleted successfully", "success");
      } else {
        addNotification(data.message || "Error deleting address", "error");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      addNotification("Error deleting address", "error");
    }
  };

  const tabs = [
    { id: "orders", icon: Package, label: "My Orders" },
    { id: "profile", icon: User, label: "Profile Info" },
    { id: "address", icon: MapPin, label: "Addresses" },
    { id: "cards", icon: CreditCard, label: "Payment Cards" },
  ];

  if (!user) return null;

  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <div className="container py-5">
        <div className="row g-4">
          {/* SIDEBAR */}
          <div className="col-lg-3">
            <div className="bg-white rounded shadow-sm overflow-hidden">
              <div className="p-4 border-bottom text-center">
                <div
                  className="mx-auto mb-3 rounded-circle bg-light d-flex align-items-center justify-content-center fw-bold fs-1 border"
                  style={{ width: 100, height: 100 }}
                >
                  {profileData.profilePic ? (
                    <img
                      src={profileData.profilePic}
                      alt="Profile"
                      className="w-100 h-100 object-fit-cover rounded-circle"
                    />
                  ) : (
                    (profileData.firstName && profileData.firstName[0]) || "U"
                  )}
                </div>
                <h5 className="fw-bold m-0">{profileData.firstName}</h5>
                <small className="text-muted">{user.email}</small>
              </div>
              <div className="list-group list-group-flush">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`list-group-item list-group-item-action border-0 py-3 ${
                      activeTab === t.id ? "bg-light fw-bold" : ""
                    }`}
                  >
                    <t.icon size={18} className="me-2" /> {t.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="list-group-item list-group-item-action border-0 py-3 text-danger"
                >
                  <LogOut size={18} className="me-2" /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="col-lg-9">
            <div className="bg-white rounded shadow-sm p-4 h-100">
              {/* ORDERS TAB */}
              {activeTab === "orders" && (
                <div className="animate__animated animate__fadeIn">
                  <h5 className="fw-bold mb-4 border-bottom pb-2">
                    Order History
                  </h5>
                  {orders.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <Package size={40} className="mb-3 opacity-25" />
                      <h5>No orders yet.</h5>
                      <button
                        className="btn btn-outline-dark btn-sm mt-2"
                        onClick={() => navigate("/")}
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    orders.map((o, i) => (
                      <div
                        key={i}
                        className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <span className="badge bg-success">
                            Order #{o.orderNumber || o._id || "N/A"}
                          </span>
                          <p className="mb-0 small text-muted">
                            Placed on {formatDate(o.createdAt)}
                          </p>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold mb-2">
                            ₹{o.totalAmount || 0}
                          </div>
                          <button
                            className="btn btn-sm btn-outline-dark"
                            onClick={() =>
                              navigate(`/tracking/${o.orderNumber || o._id}`)
                            }
                          >
                            Track <ExternalLink size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <div className="animate__animated animate__fadeIn">
                  <div className="d-flex justify-content-between mb-4 border-bottom pb-2">
                    <h5 className="fw-bold">Personal Information</h5>
                    <button
                      className={`btn btn-sm ${
                        isEditing ? "btn-success" : "btn-outline-dark"
                      }`}
                      onClick={() =>
                        isEditing ? handleSave() : setIsEditing(true)
                      }
                    >
                      {isEditing ? (
                        <>
                          <Save size={14} className="me-1" /> Save
                        </>
                      ) : (
                        <>
                          <Edit2 size={14} className="me-1" /> Edit
                        </>
                      )}
                    </button>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small text-muted fw-bold">
                        Full Name
                      </label>
                      <input
                        className="form-control bg-light"
                        value={profileData.firstName}
                        disabled
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="small text-muted fw-bold">
                        Email Address
                      </label>
                      <input
                        className={`form-control ${
                          isEditing ? "border-primary" : ""
                        }`}
                        value={profileData.email}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="small text-muted fw-bold">
                        Mobile Number <span className="text-muted small">(Read-only)</span>
                      </label>
                      <input
                        className="form-control bg-light"
                        value={profileData.mobile}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ADDRESS TAB */}
              {activeTab === "address" && (
                <div className="animate__animated animate__fadeIn">
                  <div className="d-flex justify-content-between mb-4 border-bottom pb-2">
                    <h5 className="fw-bold">Saved Addresses</h5>
                    <button
                      className="btn btn-sm btn-dark"
                      onClick={() => setShowAddAddress(!showAddAddress)}
                    >
                      <Plus size={16} /> Add New
                    </button>
                  </div>

                  {showAddAddress && (
                    <div className="card p-3 mb-4 bg-light border-0">
                      <div className="row g-2">
                        <div className="col-12">
                          <input
                            className="form-control form-control-sm"
                            placeholder="Street / Flat"
                            value={newAddress.street}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                street: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-4">
                          <input
                            className="form-control form-control-sm"
                            placeholder="City"
                            value={newAddress.city}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                city: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-4">
                          <input
                            className="form-control form-control-sm"
                            placeholder="State"
                            value={newAddress.state}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                state: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-4">
                          <input
                            className="form-control form-control-sm"
                            placeholder="Zip"
                            value={newAddress.zip}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                zip: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-12 text-end mt-2">
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={handleAddAddress}
                          >
                            Save Address
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setShowAddAddress(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Registered Address Section */}
                  {addresses.filter((a) => a.isDefault).map((a) => (
                    <div key={a._id} className="mb-4">
                      <h6 className="fw-bold text-muted mb-2">
                        <span className="badge bg-primary me-2">Registered Address</span>
                        (From Registration)
                      </h6>
                      <div className="border rounded p-3 bg-white" style={{ borderLeft: "4px solid #007bff" }}>
                        <div className="d-flex gap-3">
                          <MapPin size={20} className="text-primary mt-1 flex-shrink-0" />
                          <div className="flex-grow-1">
                            <p className="mb-0 fw-medium">
                              {a.street}, {a.city}, {a.state} - {a.zipCode}
                            </p>
                            <small className="text-muted">Default Address</small>
                          </div>
                          <button
                            className="btn btn-sm btn-outline-primary align-self-start"
                            onClick={() => {
                              setNewAddress({
                                street: a.street,
                                city: a.city,
                                state: a.state,
                                zip: a.zipCode,
                              });
                              // Show edit mode
                              const editBtn = document.querySelector("[data-edit-default]");
                              if (editBtn) editBtn.click();
                            }}
                          >
                            <Edit2 size={14} /> Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Additional Addresses Section */}
                  {addresses.filter((a) => !a.isDefault).length > 0 && (
                    <div className="mt-4">
                      <h6 className="fw-bold text-muted mb-2">
                        <span className="badge bg-secondary me-2">Additional Addresses</span>
                      </h6>
                      <div className="d-flex flex-column gap-3">
                        {addresses.filter((a) => !a.isDefault).map((a) => (
                          <div
                            key={a._id}
                            className="border rounded p-3 position-relative d-flex gap-3 bg-white"
                          >
                            <MapPin size={20} className="text-success mt-1 flex-shrink-0" />
                            <div className="flex-grow-1">
                              <p className="mb-0 fw-medium">
                                {a.street}, {a.city}, {a.state} - {a.zipCode}
                              </p>
                              <small className="text-muted">Custom Address</small>
                            </div>
                            <div className="d-flex gap-1">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => {
                                  setNewAddress({
                                    street: a.street,
                                    city: a.city,
                                    state: a.state,
                                    zip: a.zipCode,
                                  });
                                }}
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeAddress(a._id)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {addresses.length === 0 && (
                    <div className="text-center py-5 text-muted">
                      <MapPin size={40} className="mb-3 opacity-25" />
                      <h5>No addresses saved yet.</h5>
                    </div>
                  )}
                </div>
              )}

              {/* PAYMENT CARDS TAB */}
              {activeTab === "cards" && (
                <div className="animate__animated animate__fadeIn">
                  <div className="d-flex justify-content-between mb-4 border-bottom pb-2">
                    <h5 className="fw-bold">Saved Payment Cards</h5>
                    <button
                      className="btn btn-sm btn-dark"
                      onClick={() => setShowAddCard(!showAddCard)}
                      disabled={submittingCard}
                    >
                      <Plus size={16} /> Add Card
                    </button>
                  </div>

                  {/* Loading Spinner */}
                  {loadingCards && (
                    <div className="d-flex justify-content-center align-items-center py-5">
                      <Loader2 className="spinner-border text-primary me-2" />
                      <span>Loading cards...</span>
                    </div>
                  )}

                  {/* Add Card Form */}
                  {showAddCard && !loadingCards && (
                    <div className="card p-4 mb-4 bg-light border-0">
                      <h6 className="fw-bold mb-3">Add New Card</h6>
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label small fw-bold">
                            Card Number
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            value={newCard.cardNumber}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\s/g, "");
                              val = val.replace(/(\d{4})(?=\d)/g, "$1 ");
                              setNewCard({
                                ...newCard,
                                cardNumber: val,
                              });
                            }}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label small fw-bold">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="John Doe"
                            value={newCard.cardHolder}
                            onChange={(e) =>
                              setNewCard({
                                ...newCard,
                                cardHolder: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label small fw-bold">
                            Expiry Month
                          </label>
                          <select
                            className="form-select"
                            value={newCard.expiryMonth}
                            onChange={(e) =>
                              setNewCard({
                                ...newCard,
                                expiryMonth: e.target.value,
                              })
                            }
                          >
                            <option value="">MM</option>
                            {Array.from({ length: 12 }, (_, i) =>
                              String(i + 1).padStart(2, "0")
                            ).map((month) => (
                              <option key={month} value={month}>
                                {month}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label small fw-bold">
                            Expiry Year
                          </label>
                          <select
                            className="form-select"
                            value={newCard.expiryYear}
                            onChange={(e) =>
                              setNewCard({
                                ...newCard,
                                expiryYear: e.target.value,
                              })
                            }
                          >
                            <option value="">YY</option>
                            {Array.from(
                              { length: 10 },
                              (_, i) => new Date().getFullYear() + i
                            ).map((year) => (
                              <option key={year} value={String(year).slice(-2)}>
                                {String(year).slice(-2)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label small fw-bold">
                            CVV
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="123"
                            maxLength="4"
                            value={newCard.cvv}
                            onChange={(e) =>
                              setNewCard({
                                ...newCard,
                                cvv: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-12 text-end mt-3">
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={handleAddCard}
                            disabled={submittingCard}
                          >
                            {submittingCard ? (
                              <>
                                <Loader2 size={14} className="spinner-border me-1" /> Adding...
                              </>
                            ) : (
                              <>
                                <Plus size={14} className="me-1" /> Add Card
                              </>
                            )}
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => {
                              setShowAddCard(false);
                              setNewCard({
                                cardNumber: "",
                                cardHolder: "",
                                expiryMonth: "",
                                expiryYear: "",
                                cvv: "",
                              });
                            }}
                            disabled={submittingCard}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Display Saved Cards */}
                  {!loadingCards && (
                    <>
                      {cards.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                          <CreditCard size={40} className="mb-3 opacity-25" />
                          <h5>No payment cards saved yet.</h5>
                          <p className="small">Add a card to make quick purchases</p>
                        </div>
                      ) : (
                        cards.map((card) => (
                          <div
                            key={card._id}
                            className="border rounded p-4 mb-3 bg-white d-flex justify-content-between align-items-center"
                            style={{
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              color: "white",
                            }}
                          >
                            <div>
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <CreditCard size={20} />
                                <span className="fw-bold">Credit/Debit Card</span>
                              </div>
                              <div className="fs-5 fw-bold letter-spacing-2 mb-2">
                                •••• •••• •••• {card.cardNumber.slice(-4)}
                              </div>
                              <div className="d-flex justify-content-between">
                                <span className="small">
                                  {card.cardHolder}
                                </span>
                                <span className="small">
                                  {card.expiryMonth}/{card.expiryYear}
                                </span>
                              </div>
                            </div>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteCard(card._id)}
                              disabled={submittingCard}
                              title="Delete card"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))
                      )}
                    </>
                  )}
                </div>
              )}            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;