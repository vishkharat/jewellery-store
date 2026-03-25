const User = require("../models/User");

const validateAddressFields = (data) => {
  const requiredFields = [
    "fullName",
    "phone",
    "addressLine",
    "city",
    "state",
    "postalCode",
  ];

  for (const field of requiredFields) {
    if (!data[field] || !String(data[field]).trim()) {
      return `${field} is required`;
    }
  }

  if (!/^[0-9]{10}$/.test(String(data.phone).trim())) {
    return "Phone must be exactly 10 digits";
  }

  if (!/^[0-9]{6}$/.test(String(data.postalCode).trim())) {
    return "Postal code must be exactly 6 digits";
  }

  return null;
};

// GET ALL ADDRESSES
const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("addresses");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const sortedAddresses = [...(user.addresses || [])].sort(
      (a, b) => Number(b.isDefault) - Number(a.isDefault)
    );

    res.json(sortedAddresses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ADD ADDRESS
const addAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      addressLine,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    const validationError = validateAddressFields({
      fullName,
      phone,
      addressLine,
      city,
      state,
      postalCode,
    });

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const shouldBeDefault =
      Boolean(isDefault) || !Array.isArray(user.addresses) || user.addresses.length === 0;

    if (shouldBeDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      fullName: fullName.trim(),
      phone: phone.trim(),
      addressLine: addressLine.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country?.trim() || "India",
      isDefault: shouldBeDefault,
    });

    await user.save();

    const sortedAddresses = [...user.addresses].sort(
      (a, b) => Number(b.isDefault) - Number(a.isDefault)
    );

    res.status(201).json(sortedAddresses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE ADDRESS
const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      phone,
      addressLine,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    const validationError = validateAddressFields({
      fullName,
      phone,
      addressLine,
      city,
      state,
      postalCode,
    });

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const address = user.addresses.id(id);

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    if (Boolean(isDefault)) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    address.fullName = fullName.trim();
    address.phone = phone.trim();
    address.addressLine = addressLine.trim();
    address.city = city.trim();
    address.state = state.trim();
    address.postalCode = postalCode.trim();
    address.country = country?.trim() || "India";
    address.isDefault = Boolean(isDefault);

    await user.save();

    const sortedAddresses = [...user.addresses].sort(
      (a, b) => Number(b.isDefault) - Number(a.isDefault)
    );

    res.json(sortedAddresses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// SET DEFAULT ADDRESS
const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const address = user.addresses.id(id);

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    user.addresses.forEach((addr) => {
      addr.isDefault = String(addr._id) === String(id);
    });

    await user.save();

    const sortedAddresses = [...user.addresses].sort(
      (a, b) => Number(b.isDefault) - Number(a.isDefault)
    );

    res.json(sortedAddresses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE ADDRESS
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const address = user.addresses.id(id);

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    const wasDefault = address.isDefault;
    address.deleteOne();

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    const sortedAddresses = [...user.addresses].sort(
      (a, b) => Number(b.isDefault) - Number(a.isDefault)
    );

    res.json(sortedAddresses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
};