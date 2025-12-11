import React, { useState } from 'react';

const loadScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

const Payment = () => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            return;
        }

        // Mock Order Creation (In real app, fetch this from backend)
        // const result = await axios.post('/payment/orders');

        // Mocking the order details
        const options = {
            key: "rzp_test_...PlaceholderKey...", // Enter the Key ID generated from the Dashboard
            amount: "199900", // Amount is in currency subunits. Default currency is INR. Hence, 199900 refers to 199900 paise
            currency: "INR",
            name: "CourseMastery",
            description: "Pro Membership Transaction",
            image: "https://example.com/your_logo", // You can add your logo url
            order_id: "", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            handler: function (response) {
                alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                // Verify payment on backend
            },
            prefill: {
                name: "Bhanu",
                email: "bhanu@example.com",
                contact: "9999999999"
            },
            notes: {
                address: "CourseMastery Corporate Office"
            },
            theme: {
                color: "#4f46e5"
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-8 text-center">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">
                        Upgrade to Pro
                    </h2>
                    <p className="mt-2 text-indigo-100 text-lg">
                        Unlock all premium courses and features.
                    </p>
                </div>

                <div className="px-6 py-8">
                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-slate-900 mb-4">Order Summary</h3>
                        <div className="flex justify-between items-center py-3 border-b border-slate-100">
                            <span className="text-slate-600">Pro Membership (Yearly)</span>
                            <span className="font-semibold text-slate-900">₹1,999.00</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-slate-900 font-bold">Total</span>
                            <span className="text-2xl font-bold text-indigo-600">₹1,999.00</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Processing...' : 'Pay with Razorpay'}
                    </button>

                    <p className="mt-6 text-center text-xs text-slate-400">
                        Secure payment powered by Razorpay.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Payment;
