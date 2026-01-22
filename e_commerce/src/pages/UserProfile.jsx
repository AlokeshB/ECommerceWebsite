import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useOrder } from "../context/OrderContext";
import {
  Package,
  User,
  MapPin,
  Settings,
  LogOut,
  Camera,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
 
const UserProfile = () => {
  const { user, logout } = useAuth();
  const { getUserOrders } = useOrder();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
 
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("orders");
  const [isEditing, setIsEditing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [orders, setOrders] = useState([]);
 
  // Profile Data State
  const [profileData, setProfileData] = useState({
    firstName: "",
    email: "",
    mobile: "",
    altMobile: "",
    dob: "",
    age: "",
    profilePic: null,
  });
 
  // Address Data State
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    zip: "",
    state: "",
  });
  const [showAddAddress, setShowAddAddress] = useState(false);
 
  // --- INITIALIZATION ---
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
 
    // 1. Load User Data (Merge Auth User with LocalStorage Data)
    const savedProfile =
      JSON.parse(localStorage.getItem("fhub_user_profile")) || {};
    setProfileData({
      firstName: user.firstName || "",
      email: user.email || "",
      mobile: savedProfile.mobile || user.mobile || "",
      altMobile: savedProfile.altMobile || "",
      dob: savedProfile.dob || "",
      age: savedProfile.age || "",
      profilePic: savedProfile.profilePic || null,
    });
 
    // 2. Load Addresses
    const savedAddresses =
      JSON.parse(localStorage.getItem("fhub_address")) || [];
    if (savedAddresses.length === 0) {
      setAddresses([
        {
          id: 1,
          type: "Default",
          value: user.address || "No address provided",
        },
      ]);
    } else {
      setAddresses(savedAddresses);
    }
 
<<<<<<< Updated upstream
    // 3. Load User's Orders from OrderContext
    const userOrders = getUserOrders(user.email);
    setOrders(userOrders);
  }, [user, navigate, getUserOrders]);
=======
    // 3. Load Orders (Mocking Fetch from Local Storage for "My Orders")
    const savedOrders = JSON.parse(localStorage.getItem("fhub_orders")) || [];
    setOrders(savedOrders);
  }, [user, navigate]);
>>>>>>> Stashed changes
 
  // --- CAMERA FUNCTIONS ---
  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please allow permissions.");
      setShowCamera(false);
    }
  };
 
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
 
      const imageSrc = canvas.toDataURL("image/png");
 
      // Stop Stream
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
 
      // Save to State & LocalStorage
      const updatedProfile = { ...profileData, profilePic: imageSrc };
      setProfileData(updatedProfile);
      localStorage.setItem(
        "fhub_user_profile",
        JSON.stringify(updatedProfile)
      );
      setShowCamera(false);
    }
  };
 
  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
    setShowCamera(false);
  };
 
  // --- PROFILE LOGIC ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...profileData, [name]: value };
 
    // Auto-calculate Age
    if (name === "dob") {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      updatedData.age = age;
    }
 
    setProfileData(updatedData);
  };
 
  const saveProfileChanges = () => {
    localStorage.setItem("fhub_user_profile", JSON.stringify(profileData));
    setIsEditing(false);
    alert("Profile updated successfully!");
  };
 
  // --- ADDRESS LOGIC ---
  const addAddress = () => {
    if (!newAddress.street || !newAddress.city)
      return alert("Please fill details");
 
    const addressStr = `${newAddress.street}, ${newAddress.city}, ${newAddress.state} - ${newAddress.zip}`;
    const newAddrObj = { id: Date.now(), type: "Custom", value: addressStr };
 
    const updatedAddresses = [...addresses, newAddrObj];
    setAddresses(updatedAddresses);
    localStorage.setItem("fhub_address", JSON.stringify(updatedAddresses));
 
    setNewAddress({ street: "", city: "", zip: "", state: "" });
    setShowAddAddress(false);
  };
 
  const removeAddress = (id) => {
    const updated = addresses.filter((addr) => addr.id !== id);
    setAddresses(updated);
    localStorage.setItem("fhub_address", JSON.stringify(updated));
  };
 
  if (!user) return null;
 
  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <div className="container py-5">
        <div className="row g-4">
          {/* SIDEBAR */}
          <div className="col-lg-3">
            <div className="bg-white rounded shadow-sm overflow-hidden">
              <div className="p-4 border-bottom text-center position-relative">
                <div
                  className="mx-auto mb-3 rounded-circle overflow-hidden border border-3 border-light shadow-sm position-relative"
                  style={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: "#e9ecef",
                  }}
                >
                  {profileData.profilePic ? (
                    <img
                      src={profileData.profilePic}
                      alt="Profile"
                      className="w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center text-dark fs-1 fw-bold">
                      {user.firstName
                        ? user.firstName.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                  )}
 
                  {/* Camera Button */}
                  <button
                    onClick={startCamera}
                    className="position-absolute bottom-0 start-0 w-100 btn btn-sm btn-dark bg-opacity-50 border-0 rounded-0 py-1"
                    title="Take Photo"
                  >
                    <Camera size={14} className="text-white" />
                  </button>
                </div>
 
                <h5 className="fw-bold mb-0">{user.firstName}</h5>
                <p className="text-muted small text-truncate">{user.email}</p>
              </div>
 
              {/* Sidebar Menu */}
              <div className="list-group list-group-flush">
                <button
                  className={`list-group-item list-group-item-action border-0 py-3 ${
                    activeTab === "orders"
                      ? "bg-light fw-bold text-dark"
                      : ""
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  <Package size={18} className="me-2" /> My Orders
                </button>
                <button
                  className={`list-group-item list-group-item-action border-0 py-3 ${
                    activeTab === "profile"
                      ? "bg-light fw-bold text-dark"
                      : ""
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <User size={18} className="me-2" /> Profile Information
                </button>
                <button
                  className={`list-group-item list-group-item-action border-0 py-3 ${
                    activeTab === "address"
                      ? "bg-light fw-bold text-dark"
                      : ""
                  }`}
                  onClick={() => setActiveTab("address")}
                >
                  <MapPin size={18} className="me-2" /> Manage Addresses
                </button>
                <button
                  className="list-group-item list-group-item-action border-0 py-3 text-danger"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  <LogOut size={18} className="me-2" /> Logout
                </button>
              </div>
            </div>
          </div>
 
          {/* CONTENT AREA */}
          <div className="col-lg-9">
            <div className="bg-white rounded shadow-sm p-4 h-100 position-relative">
              {/* --- CAMERA OVERLAY --- */}
              {showCamera && (
                <div
                  className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex flex-column align-items-center justify-content-center"
                  style={{ zIndex: 1050 }}
                >
                  <div
                    className="bg-white p-3 rounded shadow-lg text-center position-relative"
                    style={{ maxWidth: "90%", width: "400px" }}
                  >
                    <button
                      onClick={closeCamera}
                      className="btn btn-sm btn-circle btn-light position-absolute top-0 end-0 m-2"
                    >
                      <X size={20} />
                    </button>
                    <h6 className="fw-bold mb-3">Take Profile Picture</h6>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-100 bg-black rounded mb-3"
                      style={{ height: "300px", objectFit: "cover" }}
                    ></video>
                    <canvas
                      ref={canvasRef}
                      style={{ display: "none" }}
                    ></canvas>
                    <button
                      onClick={captureImage}
                      className="btn btn-dark w-100"
                    >
                      <Camera size={18} className="me-2" /> Capture
                    </button>
                  </div>
                </div>
              )}
 
              {/* --- MY ORDERS TAB --- */}
              {activeTab === "orders" && (
                <div className="animate__animated animate__fadeIn">
                  <h5 className="fw-bold mb-4 border-bottom pb-2">
                    Order History
                  </h5>
                  {orders.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <Package size={40} className="mb-3 opacity-25" />
                      <h5>No orders placed yet.</h5>
                      <button
                        className="btn btn-outline-dark btn-sm mt-2"
                        onClick={() => navigate("/")}
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {orders.map((order, idx) => (
                        <div
                          key={idx}
                          className="border rounded p-3 hover-shadow transition-all"
                        >
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <span className="badge bg-success mb-1">
                                Order #
                                {order.id || Math.floor(Math.random() * 10000)}
                              </span>
                              <p className="mb-0 small text-muted">
                                Placed on{" "}
                                {new Date(
                                  order.date || Date.now()
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="fw-bold text-dark">
                              ₹{order.total}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <span className="small text-muted">
                              {order.items ? order.items.length : 0} items
                            </span>
                            <button
                              className="btn btn-sm btn-outline-dark d-flex align-items-center gap-1"
                              onClick={() =>
                                navigate(`/tracking/${order.id || "new"}`)
                              }
                            >
                              Track Order <ExternalLink size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
 
              {/* --- PROFILE INFO TAB --- */}
              {activeTab === "profile" && (
                <div className="animate__animated animate__fadeIn">
                  <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                    <h5 className="fw-bold mb-0">Personal Information</h5>
                    {!isEditing ? (
                      <button
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit2 size={14} className="me-1" /> Edit
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={saveProfileChanges}
                      >
                        <Save size={14} className="me-1" /> Save Changes
                      </button>
                    )}
                  </div>
 
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small text-muted fw-bold">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="firstName"
                        value={profileData.firstName}
                        disabled
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="small text-muted fw-bold">
                        User ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={user.id || "N/A"}
                        disabled
                      />
                    </div>
 
                    <div className="col-md-6">
                      <label className="small text-muted fw-bold">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${
                          isEditing ? "border-primary" : ""
                        }`}
                        value={profileData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="small text-muted fw-bold">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        className={`form-control ${
                          isEditing ? "border-primary" : ""
                        }`}
                        value={profileData.mobile}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
 
                    {/* NEW FIELDS: Alt Mobile, DOB, Age */}
                    <div className="col-md-6">
                      <label className="small text-muted fw-bold">
                        Alternate Mobile (Optional)
                      </label>
                      <input
                        type="tel"
                        name="altMobile"
                        className={`form-control ${
                          isEditing ? "border-primary" : ""
                        }`}
                        value={profileData.altMobile}
                        onChange={handleInputChange}
                        placeholder="Alternate Number"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="small text-muted fw-bold">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dob"
                        className={`form-control ${
                          isEditing ? "border-primary" : ""
                        }`}
                        value={profileData.dob}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="small text-muted fw-bold">Age</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        value={profileData.age}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              )}
 
              {/* --- MANAGE ADDRESS TAB --- */}
              {activeTab === "address" && (
                <div className="animate__animated animate__fadeIn">
                  <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                    <h5 className="fw-bold mb-0">Saved Addresses</h5>
                    <button
                      className="btn btn-sm btn-dark"
                      onClick={() => setShowAddAddress(!showAddAddress)}
                    >
                      <Plus size={16} className="me-1" /> Add New
                    </button>
                  </div>
 
                  {/* Add Address Form */}
                  {showAddAddress && (
                    <div className="card p-3 mb-4 bg-light border-0">
                      <h6 className="fw-bold mb-3">Add New Address</h6>
                      <div className="row g-2">
                        <div className="col-12">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Street / Flat / Building"
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
                            type="text"
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
                            type="text"
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
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Zip Code"
                            value={newAddress.zip}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                zip: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-12 mt-2 text-end">
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={addAddress}
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
 
                  <div className="d-flex flex-column gap-3">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="border rounded p-3 position-relative bg-white"
                      >
                        <div className="d-flex align-items-start gap-3">
                          <MapPin
                            size={20}
                            className="text-primary mt-1 flex-shrink-0"
                          />
                          <div>
                            <span className="badge bg-secondary mb-1">
                              {addr.type}
                            </span>
                            <p className="mb-0 text-dark fw-medium">
                              {addr.value}
                            </p>
                          </div>
                        </div>
                        {addr.type !== "Default" && (
                          <button
                            className="btn btn-link text-danger position-absolute top-0 end-0 p-2"
                            onClick={() => removeAddress(addr.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
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