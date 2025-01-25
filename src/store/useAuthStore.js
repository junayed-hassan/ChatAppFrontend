import { create } from 'zustand'; // Zustand থেকে create মেথড ইম্পোর্ট করা।
import { axiosInstance } from '../lib/axios'; // কাস্টম axios instance ইম্পোর্ট করা।
import toast from 'react-hot-toast';  // ইউজারকে নোটিফিকেশন দেখানোর জন্য লাইব্রেরি।


export const useAuthStore = create((set) => ({
    authUser: null, // বর্তমান লগইন করা ইউজারের তথ্য রাখে।
    isSigningUp: false,// সাইন আপের সময় লোডিং স্টেট।
    isLoggingIn: false, // লগইনের সময় লোডিং স্টেট।
    isUpdatingProfile: false, // প্রোফাইল আপডেট করার সময় লোডিং স্টেট।
    isCheckingAuth: true, // অটোমেটিক চেক করার সময় লোডিং স্টেট।

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error checking auth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    // কাজ:
    // সার্ভার থেকে /auth/check API কল করে ইউজারের অটেনটিকেশন স্টেট যাচাই করে।
    // সফল হলে ইউজারের ডেটা authUser প্রোপার্টিতে সংরক্ষণ করে।
    // ব্যর্থ হলে authUser-এ null সেট করে।
    // লোডিং শেষ হলে isCheckingAuth ফ্ল্যাগ false করে।

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Signed up successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully")
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({authUser: res.data});
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in updata profile:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

}));