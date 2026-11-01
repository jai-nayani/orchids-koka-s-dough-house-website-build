"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Plus, Loader2, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const products = [
  {
    id: "classic-chocolate",
    name: "Classic Chocolate",
    price: 20,
    image: "/images/classic-chocolate-crinkle.jpg",
  },
  {
    id: "red-velvet",
    name: "Red Velvet",
    price: 20,
    image: "/images/red-velvet-crinkle.jpg",
  },
  {
    id: "lemon-zest",
    name: "Lemon Zest",
    price: 20,
    image: "/images/lemon-zest-crinkle.jpg",
  },
];

const hearAboutUsOptions = [
  { value: "instagram", label: "Instagram" },
  { value: "friend", label: "Friend/Family" },
  { value: "event", label: "Event" },
  { value: "google", label: "Google" },
  { value: "other", label: "Other" },
];

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
  "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM",
];

// Validation helpers
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;

function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10;
}

// Calendar helpers
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  cookies?: string;
  address?: string;
  date?: string;
  time?: string;
}

interface TouchedFields {
  name?: boolean;
  email?: boolean;
  phone?: boolean;
  address?: boolean;
  date?: boolean;
  time?: boolean;
}

export default function OrderPage() {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    "classic-chocolate": 0,
    "red-velvet": 0,
    "lemon-zest": 0,
  });
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
    hearAboutUs: "",
  });
  
  // Validation state
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [showAllErrors, setShowAllErrors] = useState(false);
  
  // Calendar state - memoize today to prevent infinite loops
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const todayTime = today.getTime(); // Stable primitive for comparisons
  
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Refs for focus management
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const cookieRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  const updateQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, prev[productId] + delta),
    }));
  };

  const totalDozens = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const subtotal = totalDozens * 20;

  // Validation functions
  const validateField = useCallback((field: string, value: string): string | undefined => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Please enter your name";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return undefined;
      case "email":
        if (!value.trim()) return "Please enter your email address";
        if (!emailRegex.test(value.trim().toLowerCase())) return "Please enter a valid email address";
        return undefined;
      case "phone":
        if (!value.trim()) return "Please enter your phone number";
        if (!isValidPhone(value)) return "Please enter a valid phone number";
        return undefined;
      case "address":
        if (deliveryMethod !== "pickup" && !value.trim()) return "Please enter a delivery address";
        return undefined;
      default:
        return undefined;
    }
  }, [deliveryMethod]);

  const validateCookies = useCallback((): string | undefined => {
    if (totalDozens === 0) return "Please select at least 1 dozen cookies";
    return undefined;
  }, [totalDozens]);

  const validateDate = useCallback((): string | undefined => {
    if (!selectedDate) return "Please select a preferred date";
    if (selectedDate.getTime() < todayTime) return "Please select a future date";
    return undefined;
  }, [selectedDate, todayTime]);

  const validateTime = useCallback((): string | undefined => {
    if (!formData.preferredTime) return "Please select a preferred time";
    return undefined;
  }, [formData.preferredTime]);

  // Update errors when relevant data changes
  useEffect(() => {
    const newErrors: FormErrors = {};
    
    if (touched.name || showAllErrors) {
      newErrors.name = validateField("name", formData.name);
    }
    if (touched.email || showAllErrors) {
      newErrors.email = validateField("email", formData.email);
    }
    if (touched.phone || showAllErrors) {
      newErrors.phone = validateField("phone", formData.phone);
    }
    if ((touched.address || showAllErrors) && deliveryMethod !== "pickup") {
      newErrors.address = validateField("address", formData.address);
    }
    if (showAllErrors) {
      newErrors.cookies = validateCookies();
      newErrors.date = validateDate();
      newErrors.time = validateTime();
    }
    
    setErrors(newErrors);
  }, [formData, touched, showAllErrors, deliveryMethod, validateField, validateCookies, validateDate, validateTime]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, phone: formatted }));
    } else if (name === "email") {
      setFormData((prev) => ({ ...prev, email: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (field: keyof TouchedFields) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // Normalize email on blur
    if (field === "email") {
      setFormData((prev) => ({ ...prev, email: prev.email.trim().toLowerCase() }));
    }
  };

  const hasValidationErrors = (): boolean => {
    const nameErr = validateField("name", formData.name);
    const emailErr = validateField("email", formData.email);
    const phoneErr = validateField("phone", formData.phone);
    const addressErr = deliveryMethod !== "pickup" ? validateField("address", formData.address) : undefined;
    const cookiesErr = validateCookies();
    const dateErr = validateDate();
    const timeErr = validateTime();
    
    return !!(nameErr || emailErr || phoneErr || addressErr || cookiesErr || dateErr || timeErr);
  };

  const scrollToFirstError = () => {
    const nameErr = validateField("name", formData.name);
    const emailErr = validateField("email", formData.email);
    const phoneErr = validateField("phone", formData.phone);
    const cookiesErr = validateCookies();
    const addressErr = deliveryMethod !== "pickup" ? validateField("address", formData.address) : undefined;
    const dateErr = validateDate();
    const timeErr = validateTime();
    
    if (nameErr && nameRef.current) {
      nameRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      nameRef.current.focus();
    } else if (emailErr && emailRef.current) {
      emailRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      emailRef.current.focus();
    } else if (phoneErr && phoneRef.current) {
      phoneRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      phoneRef.current.focus();
    } else if (cookiesErr && cookieRef.current) {
      cookieRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (addressErr && addressRef.current) {
      addressRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      addressRef.current.focus();
    } else if (dateErr && dateRef.current) {
      dateRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (timeErr && timeRef.current) {
      timeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setShowAllErrors(true);
    
    if (hasValidationErrors()) {
      setTimeout(() => scrollToFirstError(), 100);
      return;
    }

    setIsLoading(true);

    try {
      const lineItems = Object.entries(quantities)
        .filter(([, qty]) => qty > 0)
        .map(([productId, qty]) => {
          const product = products.find((p) => p.id === productId);
          return {
            name: `${product?.name} Crinkle Cookies`,
            quantity: qty,
            price: 20,
          };
        });

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineItems,
          customerEmail: formData.email,
          metadata: {
            customerName: formData.name,
            phone: formData.phone,
            deliveryMethod,
            address: formData.address,
            preferredDate: selectedDate?.toISOString().split("T")[0] || "",
            preferredTime: formData.preferredTime,
            notes: formData.notes,
            hearAboutUs: formData.hearAboutUs,
          },
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again or contact us directly.");
    } finally {
      setIsLoading(false);
    }
  };

  // Calendar navigation
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    if (newDate.getTime() >= todayTime) {
      setSelectedDate(newDate);
      setFormData((prev) => ({
        ...prev,
        preferredDate: newDate.toISOString().split("T")[0],
      }));
    }
  };

  const handleTimeSelect = (time: string) => {
    setFormData((prev) => ({ ...prev, preferredTime: time }));
  };

  // Check if we can go to previous month (don't allow going before current month)
  const canGoPrevious = currentYear > today.getFullYear() || 
    (currentYear === today.getFullYear() && currentMonth > today.getMonth());

  // Generate calendar days
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const calendarDays: (number | null)[] = [];
  
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const isDateDisabled = (day: number): boolean => {
    const date = new Date(currentYear, currentMonth, day);
    return date.getTime() < todayTime;
  };

  const isDateSelected = (day: number): boolean => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  const isToday = (day: number): boolean => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  // Validation state helpers
  const getInputClassName = (field: keyof FormErrors, baseClass: string): string => {
    const hasError = errors[field];
    const isFieldTouched = touched[field as keyof TouchedFields] || showAllErrors;
    const value = formData[field as keyof typeof formData];
    const isValid = isFieldTouched && !hasError && value;
    
    return cn(
      baseClass,
      "transition-colors duration-200",
      hasError && isFieldTouched && "border-red-500 focus:border-red-500 focus:ring-red-500",
      isValid && "border-[#6B8F71] focus:border-[#6B8F71] focus:ring-[#6B8F71]"
    );
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-[#1A1614] bg-noise">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold text-[#F5F0E8] mb-6 tracking-tight"
          >
            Order Form
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-[#A09890]"
          >
            Ovens ready — place your order here
          </motion.p>
        </div>
      </section>

      {/* Order Form Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
        <div className="mx-auto max-w-6xl">
          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Contact Information */}
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="font-serif text-2xl font-semibold text-[#2C1810] mb-6">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[#2C1810]">Name *</Label>
                      <div className="relative">
                        <Input
                          ref={nameRef}
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur("name")}
                          className={getInputClassName("name", "border-[#E8E2D9] focus:border-[#C8A96E] focus:ring-[#C8A96E] pr-10")}
                          placeholder="Your name"
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "name-error" : undefined}
                        />
                        {(touched.name || showAllErrors) && !errors.name && formData.name && (
                          <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B8F71]" />
                        )}
                      </div>
                      <AnimatePresence>
                        {errors.name && (touched.name || showAllErrors) && (
                          <motion.p
                            id="name-error"
                            initial={{ opacity: 0, y: -5, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -5, height: 0 }}
                            className="text-red-500 text-[13px]"
                          >
                            {errors.name}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#2C1810]">Email *</Label>
                      <div className="relative">
                        <Input
                          ref={emailRef}
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur("email")}
                          className={getInputClassName("email", "border-[#E8E2D9] focus:border-[#C8A96E] focus:ring-[#C8A96E] pr-10")}
                          placeholder="your@email.com"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "email-error" : undefined}
                        />
                        {(touched.email || showAllErrors) && !errors.email && formData.email && (
                          <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B8F71]" />
                        )}
                      </div>
                      <AnimatePresence>
                        {errors.email && (touched.email || showAllErrors) && (
                          <motion.p
                            id="email-error"
                            initial={{ opacity: 0, y: -5, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -5, height: 0 }}
                            className="text-red-500 text-[13px]"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="phone" className="text-[#2C1810]">Phone Number *</Label>
                      <div className="relative">
                        <Input
                          ref={phoneRef}
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur("phone")}
                          className={getInputClassName("phone", "border-[#E8E2D9] focus:border-[#C8A96E] focus:ring-[#C8A96E] pr-10")}
                          placeholder="(305) 555-1234"
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? "phone-error" : undefined}
                        />
                        {(touched.phone || showAllErrors) && !errors.phone && formData.phone && (
                          <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B8F71]" />
                        )}
                      </div>
                      <AnimatePresence>
                        {errors.phone && (touched.phone || showAllErrors) && (
                          <motion.p
                            id="phone-error"
                            initial={{ opacity: 0, y: -5, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -5, height: 0 }}
                            className="text-red-500 text-[13px]"
                          >
                            {errors.phone}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Cookie Selection */}
                <div className="bg-white rounded-2xl p-8 shadow-sm" ref={cookieRef}>
                  <h2 className="font-serif text-2xl font-semibold text-[#2C1810] mb-2">
                    Choose Your Cookies
                  </h2>
                  <p className="text-[#8B7E74] text-sm mb-6">Sold by the dozen — $20 each</p>
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl border transition-colors",
                          errors.cookies && showAllErrors
                            ? "border-red-500"
                            : "border-[#E8E2D9] hover:border-[#C8A96E]"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-[#2C1810]">{product.name}</h3>
                            <p className="text-[#C8A96E] text-sm">${product.price}/dozen</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, -1)}
                            disabled={quantities[product.id] === 0}
                            className="w-10 h-10 rounded-full border border-[#E8E2D9] flex items-center justify-center hover:border-[#C8A96E] hover:text-[#C8A96E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={`Decrease ${product.name} quantity`}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-semibold text-[#2C1810]">
                            {quantities[product.id]}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, 1)}
                            className="w-10 h-10 rounded-full border border-[#E8E2D9] flex items-center justify-center hover:border-[#C8A96E] hover:text-[#C8A96E] transition-colors"
                            aria-label={`Increase ${product.name} quantity`}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <AnimatePresence>
                    {errors.cookies && showAllErrors && (
                      <motion.p
                        initial={{ opacity: 0, y: -5, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -5, height: 0 }}
                        className="text-red-500 text-[13px] mt-4"
                      >
                        {errors.cookies}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Delivery Method */}
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="font-serif text-2xl font-semibold text-[#2C1810] mb-6">
                    Delivery Method
                  </h2>
                  <RadioGroup
                    value={deliveryMethod}
                    onValueChange={setDeliveryMethod}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 p-4 rounded-xl border border-[#E8E2D9] hover:border-[#C8A96E] transition-colors cursor-pointer">
                      <RadioGroupItem value="pickup" id="pickup" className="text-[#C8A96E]" />
                      <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                        <span className="font-semibold text-[#2C1810]">Pickup</span>
                        <span className="text-[#8B7E74] text-sm ml-2">(Free)</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-xl border border-[#E8E2D9] hover:border-[#C8A96E] transition-colors cursor-pointer">
                      <RadioGroupItem value="delivery" id="delivery" className="text-[#C8A96E]" />
                      <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                        <span className="font-semibold text-[#2C1810]">Delivery — Miami Area</span>
                        <span className="text-[#8B7E74] text-sm ml-2">(fees may apply)</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-xl border border-[#E8E2D9] hover:border-[#C8A96E] transition-colors cursor-pointer">
                      <RadioGroupItem value="ship" id="ship" className="text-[#C8A96E]" />
                      <Label htmlFor="ship" className="flex-1 cursor-pointer">
                        <span className="font-semibold text-[#2C1810]">Ship — Anywhere</span>
                        <span className="text-[#8B7E74] text-sm ml-2">(shipping fees apply)</span>
                      </Label>
                    </div>
                  </RadioGroup>

                  <AnimatePresence>
                    {(deliveryMethod === "delivery" || deliveryMethod === "ship") && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 overflow-hidden"
                      >
                        <Label htmlFor="address" className="text-[#2C1810]">Delivery Address *</Label>
                        <Textarea
                          ref={addressRef}
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur("address")}
                          className={cn(
                            "mt-2 transition-colors duration-200",
                            errors.address && (touched.address || showAllErrors)
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "border-[#E8E2D9] focus:border-[#C8A96E] focus:ring-[#C8A96E]"
                          )}
                          placeholder="Enter your full address"
                          rows={3}
                          aria-invalid={!!errors.address}
                          aria-describedby={errors.address ? "address-error" : undefined}
                        />
                        <AnimatePresence>
                          {errors.address && (touched.address || showAllErrors) && (
                            <motion.p
                              id="address-error"
                              initial={{ opacity: 0, y: -5, height: 0 }}
                              animate={{ opacity: 1, y: 0, height: "auto" }}
                              exit={{ opacity: 0, y: -5, height: 0 }}
                              className="text-red-500 text-[13px] mt-2"
                            >
                              {errors.address}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Preferred Date & Time */}
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="font-serif text-2xl font-semibold text-[#2C1810] mb-6">
                    Preferred Date & Time
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Custom Calendar */}
                    <div ref={dateRef}>
                      <Label className="text-[#2C1810] mb-3 block">Select Date *</Label>
                      <div className={cn(
                        "bg-[#FAF7F2] rounded-xl p-4 shadow-sm border transition-colors duration-200",
                        errors.date && showAllErrors ? "border-red-500" : "border-[#E8E2D9]"
                      )}>
                        {/* Calendar Header */}
                        <div className="flex items-center justify-between mb-4">
                          <button
                            type="button"
                            onClick={goToPreviousMonth}
                            disabled={!canGoPrevious}
                            className="p-2 rounded-full hover:bg-[#E8E2D9] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Previous month"
                          >
                            <ChevronLeft className="w-5 h-5 text-[#C8A96E]" />
                          </button>
                          <h3 className="font-serif text-lg font-semibold text-[#2C1810]">
                            {monthNames[currentMonth]} {currentYear}
                          </h3>
                          <button
                            type="button"
                            onClick={goToNextMonth}
                            className="p-2 rounded-full hover:bg-[#E8E2D9] transition-colors"
                            aria-label="Next month"
                          >
                            <ChevronRight className="w-5 h-5 text-[#C8A96E]" />
                          </button>
                        </div>
                        
                        {/* Day Names */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {dayNames.map((day) => (
                            <div
                              key={day}
                              className="text-center text-xs font-medium text-[#8B7E74] py-2"
                            >
                              {day}
                            </div>
                          ))}
                        </div>
                        
                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                          {calendarDays.map((day, index) => (
                            <div key={index} className="aspect-square">
                              {day !== null ? (
                                <button
                                  type="button"
                                  onClick={() => handleDateSelect(day)}
                                  disabled={isDateDisabled(day)}
                                  className={cn(
                                    "w-full h-full rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200",
                                    isDateSelected(day)
                                      ? "bg-[#C8A96E] text-white shadow-md"
                                      : isToday(day)
                                      ? "bg-[#C8A96E]/20 text-[#C8A96E] font-semibold"
                                      : isDateDisabled(day)
                                      ? "text-[#D0C8BE] cursor-not-allowed"
                                      : "text-[#2C1810] hover:bg-[#C8A96E]/10"
                                  )}
                                  aria-label={`Select ${monthNames[currentMonth]} ${day}, ${currentYear}`}
                                  aria-pressed={isDateSelected(day)}
                                >
                                  {day}
                                </button>
                              ) : (
                                <span />
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {/* Selected Date Display */}
                        {selectedDate && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 pt-4 border-t border-[#E8E2D9] text-center"
                          >
                            <p className="text-sm text-[#8B7E74]">Selected:</p>
                            <p className="font-semibold text-[#2C1810]">
                              {selectedDate.toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </motion.div>
                        )}
                      </div>
                      <AnimatePresence>
                        {errors.date && showAllErrors && (
                          <motion.p
                            initial={{ opacity: 0, y: -5, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -5, height: 0 }}
                            className="text-red-500 text-[13px] mt-2"
                          >
                            {errors.date}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Time Slot Picker */}
                    <div ref={timeRef}>
                      <Label className="text-[#2C1810] mb-3 block">Select Time *</Label>
                      <div className={cn(
                        "bg-[#FAF7F2] rounded-xl p-4 shadow-sm border transition-colors duration-200",
                        errors.time && showAllErrors ? "border-red-500" : "border-[#E8E2D9]"
                      )}>
                        <p className="text-sm text-[#8B7E74] mb-4">Available time slots</p>
                        <div className="grid grid-cols-3 gap-2 max-h-[280px] overflow-y-auto pr-1">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => handleTimeSelect(time)}
                              className={cn(
                                "py-3 px-2 rounded-lg text-sm font-medium transition-all duration-200 border",
                                formData.preferredTime === time
                                  ? "bg-[#C8A96E] text-white border-[#C8A96E] shadow-md"
                                  : "bg-white text-[#2C1810] border-[#E8E2D9] hover:border-[#C8A96E]"
                              )}
                              aria-pressed={formData.preferredTime === time}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                        
                        {/* Selected Time Display */}
                        {formData.preferredTime && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 pt-4 border-t border-[#E8E2D9] text-center"
                          >
                            <p className="text-sm text-[#8B7E74]">Selected:</p>
                            <p className="font-semibold text-[#2C1810]">{formData.preferredTime}</p>
                          </motion.div>
                        )}
                      </div>
                      <AnimatePresence>
                        {errors.time && showAllErrors && (
                          <motion.p
                            initial={{ opacity: 0, y: -5, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -5, height: 0 }}
                            className="text-red-500 text-[13px] mt-2"
                          >
                            {errors.time}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="font-serif text-2xl font-semibold text-[#2C1810] mb-6">
                    Additional Information
                  </h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-[#2C1810]">Special Requests or Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="border-[#E8E2D9] focus:border-[#C8A96E] focus:ring-[#C8A96E]"
                        placeholder="Any special instructions?"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hearAboutUs" className="text-[#2C1810]">How did you hear about us?</Label>
                      <Select
                        value={formData.hearAboutUs}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, hearAboutUs: value }))}
                      >
                        <SelectTrigger className="border-[#E8E2D9] focus:border-[#C8A96E] focus:ring-[#C8A96E]">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {hearAboutUsOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-28 bg-white rounded-2xl p-8 shadow-sm border-2 border-[#C8A96E]">
                  <h2 className="font-serif text-2xl font-semibold text-[#2C1810] mb-6">
                    Order Summary
                  </h2>
                  <div className="space-y-4 mb-6">
                    {Object.entries(quantities)
                      .filter(([, qty]) => qty > 0)
                      .map(([productId, qty]) => {
                        const product = products.find((p) => p.id === productId);
                        return (
                          <div key={productId} className="flex justify-between text-sm">
                            <span className="text-[#8B7E74]">
                              {product?.name} ({qty} dozen)
                            </span>
                            <span className="text-[#2C1810] font-medium">${qty * 20}</span>
                          </div>
                        );
                      })}
                    {totalDozens === 0 && (
                      <p className="text-[#8B7E74] text-sm italic">No cookies selected yet</p>
                    )}
                  </div>
                  <div className="border-t border-[#E8E2D9] pt-4 mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#8B7E74]">Subtotal</span>
                      <span className="text-[#2C1810] font-medium">${subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#8B7E74]">Delivery</span>
                      <span className="text-[#8B7E74]">
                        {deliveryMethod === "pickup" ? "Free" : "TBD"}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-[#E8E2D9] pt-4 mb-6">
                    <div className="flex justify-between">
                      <span className="font-semibold text-[#2C1810]">Total</span>
                      <span className="font-semibold text-[#C8A96E] text-xl">${subtotal}</span>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#C8A96E] text-[#1A1614] hover:bg-[#B8995E] rounded-full py-6 text-lg font-medium disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      "Proceed to Payment"
                    )}
                  </Button>
                  <p className="text-xs text-[#8B7E74] text-center mt-4">
                    Secure checkout powered by Stripe
                  </p>
                </div>

                {/* Alternative Payment */}
                <div className="mt-6 bg-[#F5F0E8] rounded-2xl p-6 text-center">
                  <p className="text-sm text-[#8B7E74] mb-2">You can also pay via:</p>
                  <p className="text-sm text-[#2C1810]">
                    <strong>Venmo:</strong> @kokasdoughhouse
                  </p>
                  <p className="text-sm text-[#2C1810]">
                    <strong>Zelle:</strong> 305-458-2119
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
