  "use client";

  import { useState } from "react";
  import { useRouter } from "next/navigation";
  import Image from "next/image";
  import logo from "../../../../public/logo (1).png";
  import { StaticImageData } from "next/image";

  const initialForm = {
    fullname: "",
    email: "",
    password: "",
    phone:'',
    confirmPassword: "", 
    otp: "",
    role:'employer',
  };

  type logoType = {
    img: StaticImageData;
  };

  type Errors = {
    [key: string]: string;
  };

  export default function ProviderRegister() {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");
    const [SendOtp,setShowSendOTP] = useState(false);
    const router = useRouter();
    const [banner] = useState<logoType[]>([{ img: logo }]);
    const [otpSent, setOtpSent] = useState(false);    
    const [Status,setStatus] = useState('');
    const[VerifyOtp,setVerifyOtp] = useState(false);
const [isOtpVerified, setIsOtpVerified] = useState(false);

    const validateField = (field: string, value: string) => {
      let message = "";
      switch (field) {
        case "fullname":
          if (!value.trim()) message = "This field is required";
          break;
        case "email":
          if (!value) message = "Email is required";
          else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value))
            message = "Invalid email address";
          break;
        case "password":
          if (!value) message = "Password is required";
          else if (value.length < 6)
            message = "Password must be at least 6 characters";
          break;
        case "confirmPassword":
          if (!value) message = "Please confirm your password";
          else if (value !== form.password) message = "Passwords do not match";
          break;
        default:
          break;
      }

      setErrors((prev) => ({ ...prev, [field]: message }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      validateField(name, value);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setShowSendOTP(emailRegex.test(value));
    };


  const handleVerifyOtp = async () => {
    try {
      const response = await fetch('/api/auth/employer/verifyotp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form?.email,
          emailVerificationCode: form?.otp,
        }),
      });

      if (response.ok) {
        alert('OTP Verified successfully!');
        setOtpSent(true);
        setIsOtpVerified(true);
        setVerifyOtp(false)
    setStatus("Verified successfully!");

      } 
      else {
        const data = await response.json();
        alert(data?.message || 'Failed to verify OTP.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Something went wrong while verifying OTP.');
    }
  };


const handleSendOtp = async () => {
  try {
    // ✅ Prevent sending OTP if already verified
    if (isOtpVerified) {
      alert("Email is already verified.");
      setStatus("Already verified!");
      return;
    }

    setStatus("");
    setVerifyOtp(false);
    setOtpSent(false);

    const response = await fetch('/api/auth/employer/sendotp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: form.email,
        role: form.role,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setOtpSent(true);
      setVerifyOtp(true);
      // setStatus("OTP sent successfully!");
      alert("OTP sent successfully!");
    } else {
      alert(data.message || "Failed to send OTP.");
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    alert("Something went wrong while sending OTP.");
  }
};



  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  if (!isOtpVerified) {
    alert("Please verify your email with the OTP before registering.");
    setLoading(false);
    return;
  }

  if (form.password !== form.confirmPassword) {
    setErrors((prev) => ({
      ...prev,
      confirmPassword: "Passwords do not match",
    }));
    setLoading(false);
    return;
  }

  try {
    const res = await fetch("/api/auth/employer/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullname: form.fullname,
        email: form.email,
        password: form.password,
        role: form.role,
        phone: form.phone,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Employer registered successfully!");
      localStorage.setItem('usermail', form.email);
      localStorage.setItem('userrole', form.role);
      router.push("/users/login");
      setForm(initialForm);
      setPasswordStrength("");
    } else {
      alert(data.message || "Registration failed.");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong!");
  } finally {
    setLoading(false);
  }
};


    return (
      <div className="w-full max-w-8xl mx-auto flex items-center justify-center ">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-blue-100">
              <h1 className="text-3xl mt-10">CONNECT WITH YOUR NEXT BEST CUSTOMER ON TRUEFIRMS</h1>
            </div>  
            <div>
              <div className="mb-4 flex flex-col items-center">
                {banner.map((logos, index) => (
                  <Image key={index} src={logos.img} alt="logo" width={200} height={100} />
                ))}
                {/* <p className="mt-2 text-gray-700 font-semibold">
                  World&apos;s #1 B2B Staff Augmentation Marketplace
                </p> */}
              </div>
              <h1 className="text-lg font-extrabold text-center text-blue-700 mb-6 dark:text-blue-400">
                Join TrueFirms to be found by millions of potential prospects seeking business partnerships
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off" noValidate>


                <InputField label="Full Name" name="fullname" type="text" value={form.fullname} onChange={handleChange}  required placeholder="Enter Your Full Name" />

               <div className="flex flex-col space-y-2">
  <label htmlFor="email" className="text-gray-700 font-medium">
    Email ID <span className="text-red-500">*</span>
  </label>
  <div className="flex items-center space-x-2">
    <input
      id="email"
      name="email"
      type="email"
      value={form.email}
      onChange={handleChange}
      required
      placeholder="Enter Your Email ID"
      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition"
      disabled={isOtpVerified} 
    />
    
    {SendOtp && !otpSent && (
      <button
        type="button"
        onClick={handleSendOtp}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition whitespace-nowrap"
      >
        Send OTP
      </button>
    )}
    <p className="text-green-500">{Status}</p>

  
  </div>
   {VerifyOtp && (
  <div className="flex items-center gap-3 mt-2">
    <input
      type="text"
      name="otp"
      value={form.otp}
      onChange={handleChange}
      className="flex-1 px-4 w-full py-2 border border-gray-600"
      disabled={isOtpVerified}
    />
    <button
      type="button"
      onClick={handleVerifyOtp}
      disabled={isOtpVerified}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white rounded-lg"
    >
      Verify OTP
    </button>
  </div>
)}

</div>

                <InputField label="Contact number" name="phone" type="number" value={form.phone} onChange={handleChange}  required placeholder="Phone Number" />

              <InputField label="Create Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} required placeholder="Enter Password" />
                {passwordStrength && !errors.password && (
                  <p className={`mt-1 text-sm ${passwordStrength === "Strong" ? "text-green-600" : passwordStrength === "Moderate" ? "text-yellow-600" : "text-red-500"}`}>
                      Password Strength: {passwordStrength}
                  </p>
                )}
                <InputField label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} required placeholder="Re-enter Password" />

                <div>
                  <input type="checkbox" id="terms" className="mt-1"/>
                  <label htmlFor="terms" className="ml-2 text-gray-700 dark:text-gray-300 text-sm">
                    By creating an account or logging in, you understand and agree to TrueFirms <a href="#" className="text-blue-500">Terms of Service</a> You also acknowledge our Cookie and <a href="#" className="text-blue-500">Privacy Policies</a>
                    You will receive marketing messages from TrueFirms and may opt out at any time by following the unsubscribe link in our messages, or as detailed in our terms.
                    </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg transition disabled:opacity-50"
                >
                  {loading ? "Registering..." : "Register as Provider"}
                </button>
              </form>
              <p className="text-center mt-2 mb-4">Already have an account? <a href='/users/login' className="text-blue-500">Login</a></p>
         
          
            </div>
          </div>
        </div>
    );
  }

  // Reusable InputField component
  type InputFieldProps = {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
  };

  function InputField({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder,
    required = false,
    error,
  }: InputFieldProps) {
    return (
      <div className="flex flex-col">
        <label htmlFor={name} className="mb-2 text-gray-700 dark:text-gray-300 font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`px-4 py-3 rounded-lg border ${error ? "border-red-500" : "border-gray-300 focus:border-blue-500"} focus:ring-2 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition`}
          autoComplete="off"
        />
        {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
      </div>
    );
  }
