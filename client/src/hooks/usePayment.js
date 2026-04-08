import { useCallback } from 'react';
import { orderService } from '../services/wallpaperService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const usePayment = () => {
  const { user } = useAuth();

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = useCallback(async (wallpaper, onSuccess) => {
    if (!user) { toast.error('Please login to purchase'); return; }

    const loaded = await loadRazorpay();
    if (!loaded) { toast.error('Payment gateway failed to load'); return; }

    try {
      const { data } = await orderService.create(wallpaper._id);

      const options = {
        key: data.razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'WallCraft',
        description: `Purchase: ${wallpaper.title}`,
        order_id: data.order.razorpayOrderId,
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: '#c77dff' },
        handler: async (response) => {
          try {
            await orderService.verify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success('Payment successful! You can now download this wallpaper.');
            if (onSuccess) onSuccess();
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        modal: {
          ondismiss: () => toast('Payment cancelled', { icon: '🚫' }),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
    }
  }, [user]);

  return { initiatePayment };
};
