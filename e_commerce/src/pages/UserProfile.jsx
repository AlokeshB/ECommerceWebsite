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
} from "lucide-react";

const UserProfile = () => {
  const { user, logout } = useAuth();
  const { getUserOrders } = useOrder();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("orders");
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showAddAddress, setShowAddAddress] = useState(false);

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

  // --- INITIALIZATION ---
  useEffect(() => {
    if (!user) return navigate("/");

    // 1. Load Profile Data

    const allRegisteredUsers =
      JSON.parse(localStorage.getItem("fhub_registered_user")) || [];

    // Find the specific user object that matches the currently logged-in user's email
    // Note: We assume emails are unique identifiers
    const registeredDetails = Array.isArray(allRegisteredUsers)
      ? allRegisteredUsers.find((u) => u.email === user.email)
      : null;

    // Check if there are any locally saved profile edits (which might override registration data)
    const savedLocalProfile =
      JSON.parse(localStorage.getItem("fhub_user_profile")) || {};

    setProfileData({
      firstName: user.firstName || user.fullName || "",
      email: user.email || "",
      // LOGIC FIXED:
      // 1. Check savedLocalProfile (if user edited it recently)
      // 2. Check registeredDetails.phoneNo (from the screenshot, key is 'phoneNo')
      // 3. Fallback to user.mobile or empty string
      mobile:
        savedLocalProfile.mobile ||
        registeredDetails?.phoneNo ||
        user.mobile ||
        "",
      profilePic:
        savedLocalProfile.profilePic || registeredDetails?.profilePic || null,
    });

    // 2. Load Addresses
    const savedAddresses =
      JSON.parse(localStorage.getItem("fhub_address")) || [];

    const defaultAddr = {
      id: "default-reg",
      type: "Default",
      value: user.address || "No address provided during registration",
    };

    const filteredSaved = savedAddresses.filter((a) => a.type !== "Default");
    setAddresses([defaultAddr, ...filteredSaved]);

    setOrders(getUserOrders(user.email));
  }, [user, navigate, getUserOrders]);

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
  const handleSave = () => {
    localStorage.setItem("fhub_user_profile", JSON.stringify(profileData));
    setIsEditing(false);
    alert("Profile updated!");
  };

  const handleAddAddress = () => {
    if (!newAddress.street || !newAddress.city)
      return alert("Please fill details");
    const addressStr = `${newAddress.street}, ${newAddress.city}, ${newAddress.state} - ${newAddress.zip}`;
    const updated = [
      ...addresses,
      { id: Date.now(), type: "Custom", value: addressStr },
    ];

    setAddresses(updated);
    localStorage.setItem(
      "fhub_address",
      JSON.stringify(updated.filter((a) => a.id !== "default-reg")),
    );
    setNewAddress({ street: "", city: "", zip: "", state: "" });
    setShowAddAddress(false);
  };

  const removeAddress = (id) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    localStorage.setItem(
      "fhub_address",
      JSON.stringify(updated.filter((a) => a.id !== "default-reg")),
    );
  };

  const tabs = [
    { id: "orders", icon: Package, label: "My Orders" },
    { id: "profile", icon: User, label: "Profile Info" },
    { id: "address", icon: MapPin, label: "Addresses" },
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
                            Order #{o.id || "N/A"}
                          </span>
                          <p className="mb-0 small text-muted">
                            Placed on {formatDate(o.date || o.createdAt)}
                          </p>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold mb-2">
                            ₹{o.totalAmount || o.total || 0}
                          </div>
                          <button
                            className="btn btn-sm btn-outline-dark"
                            onClick={() =>
                              navigate(`/tracking/${o.id || "new"}`)
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
                        Mobile Number
                      </label>
                      <input
                        className={`form-control ${
                          isEditing ? "border-primary" : ""
                        }`}
                        value={profileData.mobile}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            mobile: e.target.value,
                          })
                        }
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

                  {addresses.map((a) => (
                    <div
                      key={a.id}
                      className="border rounded p-3 mb-3 position-relative d-flex gap-3 bg-white"
                    >
                      <MapPin size={20} className="text-primary mt-1" />
                      <div>
                        <span
                          className={`badge ${
                            a.type === "Default" ? "bg-dark" : "bg-secondary"
                          } mb-1`}
                        >
                          {a.type}
                        </span>
                        <p className="mb-0 fw-medium">{a.value}</p>
                      </div>
                      {a.type !== "Default" && (
                        <button
                          className="btn btn-link text-danger position-absolute top-0 end-0"
                          onClick={() => removeAddress(a.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
