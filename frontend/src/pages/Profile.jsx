import { useEffect, useMemo, useState } from "react";
import {
  getUserProfileApi,
  getAddressesApi,
  addAddressApi,
  deleteAddressApi,
} from "../services/api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addingAddress, setAddingAddress] = useState(false);

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const walletGrams = useMemo(() => {
    return Number(userProfile?.silverWalletGrams ?? 0).toFixed(3);
  }, [userProfile]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const data = await getUserProfileApi(token);
      setUserProfile(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.log("Error fetching profile", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoadingAddresses(false);
        return;
      }

      const data = await getAddressesApi(token);
      setAddresses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching addresses", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchAddresses();
  }, []);

  const handleAddressChange = (e) => {
    setNewAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      setAddingAddress(true);

      const data = await addAddressApi(newAddress, token);
      setAddresses(Array.isArray(data) ? data : []);

      setNewAddress({
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
      });

      toast.success("Address added");
    } catch (error) {
      console.log("Add address error", error);
      toast.error(error.response?.data?.message || "Failed to add address");
    } finally {
      setAddingAddress(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const data = await deleteAddressApi(id, token);
      setAddresses(Array.isArray(data) ? data : []);

      toast.success("Address deleted");
    } catch (error) {
      console.log("Delete address error", error);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#fcfaf7] px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="rounded-[36px] border border-stone-200 bg-white p-8">
            <div className="h-4 w-24 rounded-full bg-stone-200" />
            <div className="mt-4 h-12 w-72 rounded-2xl bg-stone-200" />
            <div className="mt-4 h-4 w-full max-w-2xl rounded-full bg-stone-200" />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[32px] border border-stone-200 bg-white p-6">
              <div className="h-20 w-20 rounded-full bg-stone-200" />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-28 rounded-[24px] bg-stone-100"
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-stone-200 bg-white p-6">
              <div className="h-8 w-56 rounded-2xl bg-stone-200" />
              <div className="mt-5 space-y-4">
                <div className="h-24 rounded-[24px] bg-stone-100" />
                <div className="h-24 rounded-[24px] bg-stone-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!localStorage.getItem("token")) {
    return <div className="py-20 text-center text-lg">Please login first</div>;
  }

  if (!userProfile) {
    return <div className="py-20 text-center text-lg">Profile not found</div>;
  }

  return (
    <div className="bg-[#fcfaf7] px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-[36px] border border-stone-200 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
                My Account
              </p>
              <h1 className="text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl lg:text-[46px]">
                Profile
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-stone-600 sm:text-base">
                Manage your account details, saved addresses, and silver wallet
                balance from one premium account dashboard.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                to="/orders"
                className="rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 transition hover:border-black hover:bg-black hover:text-white"
              >
                View Orders
              </Link>

              <Link
                to="/wishlist"
                className="rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 transition hover:border-black hover:bg-black hover:text-white"
              >
                Wishlist
              </Link>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left Side */}
          <div className="space-y-8">
            <div className="rounded-[32px] border border-stone-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] sm:p-8">
              <div className="mb-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black text-3xl font-semibold text-white shadow-md">
                  {userProfile.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.26em] text-stone-500">
                    Account Holder
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                    {userProfile.name}
                  </h2>
                  <p className="mt-1 text-sm capitalize text-stone-500">
                    {userProfile.role}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] border border-stone-200 bg-[#fcfaf7] p-5">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
                    Full Name
                  </p>
                  <p className="mt-3 text-lg font-medium text-stone-900">
                    {userProfile.name}
                  </p>
                </div>

                <div className="rounded-[24px] border border-stone-200 bg-[#fcfaf7] p-5">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
                    Email
                  </p>
                  <p className="mt-3 break-all text-lg font-medium text-stone-900">
                    {userProfile.email}
                  </p>
                </div>

                <div className="rounded-[24px] border border-stone-200 bg-[#fcfaf7] p-5">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
                    Role
                  </p>
                  <p className="mt-3 text-lg font-medium capitalize text-stone-900">
                    {userProfile.role}
                  </p>
                </div>

                <div className="rounded-[24px] border border-stone-200 bg-[#fcfaf7] p-5">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
                    Account Status
                  </p>
                  <p className="mt-3 text-lg font-medium text-green-600">
                    Active
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-stone-200 bg-[#f8f2ea] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] sm:p-8">
              <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
                Silver Wallet Credit
              </p>
              <h2 className="mt-3 text-4xl font-semibold text-stone-900 sm:text-5xl">
                {walletGrams} g
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-stone-600">
                Exchange approved thaya pachi tamara wallet ma grams credit add
                thase. Aa grams tame checkout par use kari shako cho.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[22px] bg-white p-4">
                  <p className="text-sm font-semibold text-stone-900">
                    Wallet Ready
                  </p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    Checkout par direct redeem kari shako cho.
                  </p>
                </div>

                <div className="rounded-[22px] bg-white p-4">
                  <p className="text-sm font-semibold text-stone-900">
                    Exchange Linked
                  </p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    Approved exchange pachi grams wallet ma reflect thase.
                  </p>
                </div>

                <div className="rounded-[22px] bg-white p-4">
                  <p className="text-sm font-semibold text-stone-900">
                    Premium Benefit
                  </p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    Jewellery order cost reduce karva useful feature.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-8">
            <div className="rounded-[32px] border border-stone-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] sm:p-8">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.26em] text-stone-500">
                    Saved Addresses
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-stone-900">
                    Delivery Addresses
                  </h2>
                </div>

                <p className="text-sm text-stone-500">
                  {addresses.length} Saved
                </p>
              </div>

              {loadingAddresses ? (
                <p className="text-stone-500">Loading addresses...</p>
              ) : addresses.length === 0 ? (
                <div className="rounded-[24px] border border-stone-200 bg-[#fcfaf7] py-10 text-center text-stone-500">
                  No addresses yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className="rounded-[24px] border border-stone-200 bg-[#fcfaf7] p-5"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-stone-900">
                              {addr.fullName}
                            </p>
                            {addr.isDefault && (
                              <span className="rounded-full bg-black px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white">
                                Default
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-sm text-stone-600">
                            {addr.phone}
                          </p>
                          <p className="mt-2 text-sm leading-7 text-stone-600">
                            {addr.addressLine}
                          </p>
                          <p className="text-sm text-stone-600">
                            {addr.city}, {addr.state}
                          </p>
                          <p className="text-sm text-stone-600">
                            {addr.postalCode}, {addr.country}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[32px] border border-stone-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] sm:p-8">
              <div className="mb-6">
                <p className="text-[11px] uppercase tracking-[0.26em] text-stone-500">
                  Add New Address
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-stone-900">
                  Save Delivery Address
                </h2>
              </div>

              <form onSubmit={handleAddAddress} className="grid gap-4 md:grid-cols-2">
                <input
                  name="fullName"
                  value={newAddress.fullName}
                  onChange={handleAddressChange}
                  placeholder="Full Name"
                  className="rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
                  required
                />

                <input
                  name="phone"
                  value={newAddress.phone}
                  onChange={handleAddressChange}
                  placeholder="Phone Number"
                  className="rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
                  required
                />

                <input
                  name="addressLine"
                  value={newAddress.addressLine}
                  onChange={handleAddressChange}
                  placeholder="Address Line"
                  className="rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black md:col-span-2"
                  required
                />

                <input
                  name="city"
                  value={newAddress.city}
                  onChange={handleAddressChange}
                  placeholder="City"
                  className="rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
                  required
                />

                <input
                  name="state"
                  value={newAddress.state}
                  onChange={handleAddressChange}
                  placeholder="State"
                  className="rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
                  required
                />

                <input
                  name="postalCode"
                  value={newAddress.postalCode}
                  onChange={handleAddressChange}
                  placeholder="Pincode"
                  className="rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
                  required
                />

                <input
                  name="country"
                  value={newAddress.country}
                  onChange={handleAddressChange}
                  placeholder="Country"
                  className="rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
                  required
                />

                <button
                  type="submit"
                  disabled={addingAddress}
                  className="md:col-span-2 rounded-full bg-black px-8 py-3 text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
                >
                  {addingAddress ? "Adding..." : "Add Address"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;