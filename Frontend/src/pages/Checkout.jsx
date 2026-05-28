import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useCart } from '../contexts/CartContext';
import { useOrders } from '../contexts/OrderContext';
import OrderSummary from '../components/OrderSummary';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';

const ADDRESS_KEY = 'craftoria_saved_address';
const FREE_EXPRESS_THRESHOLD = 999;

const parsePrice = (price) => parseInt(String(price).replace(/[^\d]/g, ''), 10) || 0;

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
];

const STEPS = [
  { id: 1, label: 'Cart', path: '/cart' },
  { id: 2, label: 'Checkout', path: '/checkout' },
  { id: 3, label: 'Payment', path: null },
  { id: 4, label: 'Confirmation', path: null },
];

const trustBar = [
  {
    title: 'Secure Payments',
    text: '100% safe & encrypted',
    icon: (
      <>
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
  },
  {
    title: 'On-time Delivery',
    text: 'Track your order easily',
    icon: (
      <>
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="17" cy="18" r="2" />
        <circle cx="7" cy="18" r="2" />
      </>
    ),
  },
  {
    title: 'Easy Returns',
    text: 'Hassle-free returns',
    icon: (
      <>
        <path d="M21.5 2v6h-6" />
        <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
      </>
    ),
  },
  {
    title: 'Customer Support',
    text: "We're here to help",
    icon: (
      <>
        <path d="M3 11a9 9 0 0 1 18 0" />
        <path d="M21 11v5a2 2 0 0 1-2 2h-1" />
        <path d="M3 11v5a2 2 0 0 0 2 2h1" />
        <path d="M9 19h6" />
      </>
    ),
  },
];

const Icon = ({ children, className = 'h-5 w-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const emptyForm = {
  fullName: '',
  address: '',
  landmark: '',
  phone: '',
  city: '',
  state: '',
  pincode: '',
  country: '',
  saveAddress: false,
};

const buildStreetAddress = (address = {}) =>
  [
    address.house_number,
    address.road,
    address.neighbourhood,
    address.suburb,
    address.quarter,
  ]
    .filter(Boolean)
    .join(', ');

const getCityName = (address = {}) =>
  address.city ||
  address.town ||
  address.village ||
  address.municipality ||
  address.county ||
  '';

const matchIndianState = (state = '') =>
  INDIAN_STATES.find((item) => item.toLowerCase() === String(state).toLowerCase()) || state;

const Checkout = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();
  const { cartItems, clearCart } = useCart();
  const { createOrder, createStripeSession } = useOrders();
  const navigate = useNavigate();

  const [showSuccess, setShowSuccess] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!isLoaded || isSignedIn) return;
    toast.error('Please sign in to checkout');
    openSignIn({ redirectUrl: `${window.location.origin}/checkout` });
    navigate('/', { replace: true });
  }, [isLoaded, isSignedIn, navigate, openSignIn]);

  const orderTotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => sum + parsePrice(item.currentPrice) * item.quantity, 0),
    [cartItems]
  );

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUseLocationAutofill = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported on this device');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}&addressdetails=1`
          );

          if (!response.ok) {
            throw new Error('Unable to fetch address');
          }

          const location = await response.json();
          const address = location.address || {};
          const streetAddress = buildStreetAddress(address);
          const fallbackAddress = location.display_name || `${coords.latitude}, ${coords.longitude}`;

          setForm((prev) => ({
            ...prev,
            fullName:
              prev.fullName ||
              user?.fullName ||
              [user?.firstName, user?.lastName].filter(Boolean).join(' '),
            address: streetAddress || fallbackAddress,
            landmark:
              prev.landmark ||
              address.neighbourhood ||
              address.suburb ||
              address.quarter ||
              '',
            city: getCityName(address),
            state: matchIndianState(address.state || ''),
            pincode: address.postcode || '',
            country: address.country || 'India',
          }));

          toast.success('Location detected. Please confirm your address details.');
        } catch {
          setForm((prev) => ({
            ...prev,
            address: `${coords.latitude}, ${coords.longitude}`,
          }));
          toast.error('Location detected, but address lookup failed. Please fill remaining details.');
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        toast.error('Unable to access your location');
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  const validateForm = () => {
    const required = [
      ['fullName', 'Full name'],
      ['address', 'Address'],
      ['phone', 'Phone number'],
      ['city', 'City'],
      ['state', 'State'],
      ['pincode', 'Pincode'],
    ];
    for (const [key, label] of required) {
      if (!String(form[key]).trim()) {
        toast.error(`Please enter your ${label.toLowerCase()}`);
        return false;
      }
    }
    if (!/^\d{10}$/.test(String(form.phone).replace(/\D/g, '').slice(-10))) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!/^\d{6}$/.test(String(form.pincode).trim())) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
console.log('🔄 Starting payment processing', form);

    if (form.saveAddress) {
      try {
        const addressData = Object.fromEntries(
          Object.entries(form).filter(([key]) => key !== 'saveAddress')
        );
        localStorage.setItem(ADDRESS_KEY, JSON.stringify(addressData));
      } catch {
        /* ignore */
      }
    }

    const orderId = Date.now();
    // Build the order object for backend
    const orderData = {
      orderNumber: `GT${String(orderId).slice(-5)}`,
      items: cartItems.map(item => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: Number(item.currentPrice),
        image: item.image
      })),
      totalAmount: orderTotal,
      deliveryInfo: {
        fullName: form.fullName,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        phone: form.phone
      }
    };

    const res = await createStripeSession(orderData.items, orderData.deliveryInfo);

    if (res.success && res.url) {
      window.location.href = res.url;
    } else {
      toast.error(res.error || 'Failed to initiate payment');
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#fafafa]">
        <p className="font-sans text-gray-500 text-sm">Loading checkout...</p>
      </div>
    );
  }

  if (!isSignedIn) return null;

  if (cartItems.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  const inputClass =
    'w-full rounded-md border border-gray-200 bg-white px-4 py-3 font-sans text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#760000]/15 focus:border-[#760000] transition';

  return (
    <>
      {showSuccess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 text-center max-w-sm mx-4">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <Icon className="h-9 w-9 text-green-600">
                  <path d="M20 6 9 17l-5-5" />
                </Icon>
              </div>
            </div>
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
            <p className="font-sans text-gray-500 text-sm">
              Your order has been placed successfully. Redirecting to your orders…
            </p>
          </div>
        </div>
      )}

      <div className="bg-[#fafafa] min-h-screen">
        {/* Promo strip */}
        <div className="bg-[#760000] text-white text-center py-2.5 px-4 mt-[72px] sm:mt-[76px]">
          <p className="font-sans text-xs sm:text-sm font-medium tracking-wide">
            Free Express Delivery on Orders Above {formatPrice(FREE_EXPRESS_THRESHOLD)}
          </p>
        </div>

        <div className="site-container py-8 sm:py-10">
          {/* Progress steps */}
          <div className="mb-10 overflow-x-auto">
            <div className="flex items-center justify-center min-w-[520px] gap-0">
              {STEPS.map((step, index) => {
                const isComplete = step.id < 2;
                const isActive = step.id === 2;
                const isLast = index === STEPS.length - 1;

                return (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      {step.path && !isActive ? (
                        <Link
                          to={step.path}
                          className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${
                            isComplete
                              ? 'bg-[#760000] border-[#760000] text-white'
                              : 'border-gray-300 text-gray-400 bg-white'
                          }`}
                        >
                          {isComplete ? (
                            <Icon className="h-4 w-4">
                              <path d="M20 6 9 17l-5-5" />
                            </Icon>
                          ) : (
                            <span className="text-sm font-bold">{step.id}</span>
                          )}
                        </Link>
                      ) : (
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold ${
                            isActive
                              ? 'bg-[#760000] border-[#760000] text-white'
                              : isComplete
                                ? 'bg-[#760000] border-[#760000] text-white'
                                : 'border-gray-300 text-gray-400 bg-white'
                          }`}
                        >
                          {isComplete && !isActive ? (
                            <Icon className="h-4 w-4">
                              <path d="M20 6 9 17l-5-5" />
                            </Icon>
                          ) : (
                            step.id
                          )}
                        </div>
                      )}
                      <span
                        className={`font-heading text-[11px] font-semibold uppercase tracking-[0.12em] ${
                          isActive || isComplete ? 'text-[#760000]' : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {!isLast && (
                      <div
                        className={`h-0.5 w-16 sm:w-24 lg:w-32 mx-2 sm:mx-4 mb-6 shrink-0 ${
                          isComplete ? 'bg-[#760000]' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 xl:gap-10 items-start">
            {/* Delivery Information */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-8">
              <div className="flex items-center gap-2.5 mb-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-[#760000]">
                  <Icon className="h-5 w-5">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </Icon>
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
                  Delivery Information
                </h2>
              </div>

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handlePayment();
                }}
              >
                <div>
                  <label className="micro-label text-gray-700 mb-1.5 block">Full Name</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="micro-label text-gray-700 mb-1.5 block">Address</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="House no., street, area"
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="micro-label text-gray-700 mb-1.5 block">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={form.landmark}
                      onChange={(e) => updateField('landmark', e.target.value)}
                      placeholder="Near metro, mall, etc."
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="micro-label text-gray-700 mb-1.5 block">Phone Number</label>
                    <div className="flex rounded-md border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#760000]/15 focus-within:border-[#760000]">
                      <span className="inline-flex items-center px-3 bg-gray-50 border-r border-gray-200 text-sm font-semibold text-gray-600 shrink-0">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="10-digit mobile"
                        className="flex-1 px-4 py-3 font-sans text-sm text-gray-800 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="micro-label text-gray-700 mb-1.5 block">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="City"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="micro-label text-gray-700 mb-1.5 block">State</label>
                    <select
                      value={form.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="micro-label text-gray-700 mb-1.5 block">Pincode</label>
                    <input
                      type="text"
                      value={form.pincode}
                      onChange={(e) => updateField('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="6-digit pincode"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="micro-label text-gray-700 mb-1.5 block">Country</label>
                    <select
                      value={form.country}
                      onChange={(e) => updateField('country', e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select country</option>
                      <option value="India">India</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={form.saveAddress}
                    onChange={(e) => updateField('saveAddress', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#760000] focus:ring-[#760000]"
                  />
                  <span className="font-sans text-sm text-gray-700">
                    Save this address for faster checkout
                  </span>
                </label>
              </form>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="font-sans text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  OR
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="rounded-xl bg-[#fff5f4] border border-red-50 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#760000] border border-red-100">
                    <Icon className="h-5 w-5">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v2" />
                      <path d="M12 20v2" />
                      <path d="m4.93 4.93 1.41 1.41" />
                      <path d="m17.66 17.66 1.41 1.41" />
                      <path d="M2 12h2" />
                      <path d="M20 12h2" />
                    </Icon>
                  </span>
                  <div>
                    <p className="font-sans text-sm font-semibold text-gray-900">Use My Location</p>
                    <p className="font-sans text-xs text-gray-500 mt-0.5">
                      Allow location access to auto-fill your address
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleUseLocationAutofill}
                  disabled={isLocating}
                  className="w-full md:w-auto shrink-0 rounded-md border-2 border-[#760000] px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#760000] hover:bg-white transition whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLocating ? 'Detecting...' : 'Use My Location'}
                </button>
              </div>
            </div>

            <OrderSummary
              cartItems={cartItems}
              primaryLabel="Proceed to Payment"
              onPrimaryClick={handlePayment}
              stickyTop="xl:top-28"
            />
          </div>
        </div>

        {/* Trust bar */}
        <div className="bg-[#fff5f4] border-t border-red-50 mt-4">
          <div className="site-container py-8">
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {trustBar.map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#760000] border border-red-100">
                    <Icon className="h-5 w-5">{item.icon}</Icon>
                  </span>
                  <div>
                    <p className="font-sans text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="font-sans text-xs text-gray-500 mt-0.5">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
