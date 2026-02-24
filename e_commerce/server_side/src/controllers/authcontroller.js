const User = require("../models/User");
const { generateToken } = require("../utils/generateToken");

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, phone, address, city, state, zipCode, country } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, email, password, confirmPassword",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create user with only required fields, optional fields will be assigned if provided
    const userData = {
      name,
      email,
      password,
    };

    // Add optional fields if provided
    if (phone) userData.phone = phone;
    if (address) userData.address = address;
    if (city) userData.city = city;
    if (state) userData.state = state;
    if (zipCode) userData.zipCode = zipCode;
    if (country) userData.country = country;

    // If address is provided during registration, also add it to addresses array
    if (address && city && state && zipCode) {
      userData.addresses = [
        {
          street: address,
          city,
          state,
          zipCode,
          country: country || "India",
          isDefault: true,
        },
      ];
    }

    const user = await User.create(userData);

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        country: user.country,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/login
// @desc    Login user or admin with strict role validation
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password, loginMode } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Strict role validation based on login mode
    const mode = loginMode || "user";

    if (mode === "user") {
      // User login mode - reject admin accounts
      if (user.role === "admin") {
        return res.status(403).json({
          success: false,
          message: "Admin credentials detected. Please toggle to Admin Login to continue.",
        });
      }
    } else if (mode === "admin") {
      // Admin login mode - reject user accounts
      if (user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "User credentials detected. Only admin accounts can access this portal.",
        });
      }
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, city, state, zipCode, country } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (zipCode) updateData.zipCode = zipCode;
    if (country) updateData.country = country;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatch = await user.comparePassword(oldPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid old password",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/addresses
// @desc    Add new address
// @access  Private
exports.addAddress = async (req, res, next) => {
  try {
    const { fullName, phone, street, address, city, state, zipCode, country, type, isDefault } = req.body;

    if (!fullName || !phone || (!street && !address) || !city || !state || !zipCode) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required address fields (fullName, phone, address/street, city, state, zipCode)",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If this is the first address or marked as default, set all others to non-default
    if (isDefault || user.addresses.length === 0) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    const newAddress = {
      fullName: fullName || user.name,
      phone: phone || user.phone,
      street: street || address,
      address: address || street,
      city,
      state,
      zipCode,
      country: country || "India",
      type: type || "HOME",
      isDefault: isDefault || user.addresses.length === 0,
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/auth/addresses
// @desc    Get all addresses for user
// @access  Private
exports.getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      addresses: user.addresses || [],
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/auth/addresses/:addressId
// @desc    Update address
// @access  Private
exports.updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const { fullName, phone, street, address, city, state, zipCode, country, type, isDefault } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const addressObj = user.addresses.id(addressId);

    if (!addressObj) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    if (fullName) addressObj.fullName = fullName;
    if (phone) addressObj.phone = phone;
    if (street) addressObj.street = street;
    if (address) addressObj.address = address;
    if (city) addressObj.city = city;
    if (state) addressObj.state = state;
    if (zipCode) addressObj.zipCode = zipCode;
    if (country) addressObj.country = country;
    if (type) addressObj.type = type;

    if (isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
      addressObj.isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/auth/addresses/:addressId
// @desc    Delete address (cannot delete default address)
// @access  Private
exports.deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Prevent deletion of default address
    if (address.isDefault) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete your registered address. You can only edit it.",
      });
    }

    user.addresses.pull(addressId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};
