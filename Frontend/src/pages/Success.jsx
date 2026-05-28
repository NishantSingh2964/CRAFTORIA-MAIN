import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    if (sessionId) {
      clearCart();
      toast.success('Order placed successfully!');
      
      const timer = setTimeout(() => {
        navigate('/my-orders');
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      navigate('/');
    }
  }, [sessionId, clearCart, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#fafafa] px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-green-50 p-4 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>
        
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        
        <p className="font-sans text-gray-600 mb-8 leading-relaxed">
          Your order has been confirmed and is being processed. 
          Thank you for choosing CRAFTORIO for your gifting needs.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/my-orders')}
            className="w-full bg-[#760000] text-white font-sans font-bold py-3.5 rounded-xl hover:bg-black transition-all duration-300 shadow-lg shadow-red-900/10"
          >
            View My Orders
          </button>
          
          <p className="font-sans text-xs text-gray-400 italic">
            Redirecting to your orders in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;
