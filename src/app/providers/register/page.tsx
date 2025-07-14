  "use client";

  import { useState, useRef } from "react";
  import { useRouter } from "next/navigation";
  import ReCAPTCHA from "react-google-recaptcha";
  import Image from "next/image";
  import logo from "../../../../public/logo (1).png";
  import { StaticImageData } from "next/image";

  const initialForm = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "", // ✅ added
    role:'provider'
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
    const [token, setToken] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const router = useRouter();
    // const secretkey = 6LfAknsrAAAAANWJTAZER3ah0UDSa1Jt1NTrBTPO
    const [banner] = useState<logoType[]>([{ img: logo }]);

    // useEffect(() => {
    //   validateField("password", form.password);
    //   validateField("confirmPassword", form.confirmPassword);
    //   checkPasswordStrength(form.password);
    // }, [form.password, form.confirmPassword]);

    const validateField = (field: string, value: string) => {
      let message = "";

      switch (field) {
        case "firstname":
        case "lastname":
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

    // const checkPasswordStrength = (password: string) => {
    //   if (!password) setPasswordStrength("");
    //   else if (password.length < 6) setPasswordStrength("Weak");
    //   else if (/[A-Z]/.test(password) && /[0-9]/.test(password))
    //     setPasswordStrength("Strong");
    //   else setPasswordStrength("Moderate");
    // };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      validateField(name, value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      if (!token) {
        setMessage("Please verify the CAPTCHA");
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
        const res = await fetch("/api/auth/provider/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstname: form.firstname,
            lastname: form.lastname,
            email: form.email,
            password: form.password,
            role:form.role,
            captchaToken: token,
          }),
        });

        localStorage.setItem('usermail', form.email);
        localStorage.setItem('userrole', form.role);
        console.log("Saving role to localStorage:", form.role);
        const data = await res.json();
        if (res.ok) {
          alert("Provider registered successfully!");
          router.push("/providers/register/verify");

          setForm(initialForm);
          setPasswordStrength("");
          recaptchaRef.current?.reset();
          setToken(null);
        } else {
          alert(data.message || "Registration failed.");
        }
      } catch (err) {
        alert("Something went wrong!");
        console.log(err);
        
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
                <p className="mt-2 text-gray-700 font-semibold">
                  World&apos;s #1 B2B Staff Augmentation Marketplace
                </p>
              </div>
              <h1 className="text-lg font-extrabold text-center text-blue-700 mb-6 dark:text-blue-400">
                Join TrueFirms to be found by millions of potential prospects seeking business partnerships.
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="First Name" name="firstname" value={form.firstname} onChange={handleChange} error={errors.firstname} required placeholder="Enter First Name" />
                  <InputField label="Last Name" name="lastname" value={form.lastname} onChange={handleChange} error={errors.lastname} required placeholder="Enter Last Name" />
                </div>

                <InputField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required placeholder="Enter Email Address" />

                {/* Password */}
                <InputField label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} required placeholder="Enter Password" />
                {passwordStrength && !errors.password && (
                  <p className={`mt-1 text-sm ${passwordStrength === "Strong" ? "text-green-600" : passwordStrength === "Moderate" ? "text-yellow-600" : "text-red-500"}`}>
                    Password Strength: {passwordStrength}
                  </p>
                )}

                {/* Confirm Password */}
                <InputField label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} required placeholder="Re-enter Password" />

                {/* reCAPTCHA */}
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LfORIIrAAAAAFxpDfxVZsa0IpTxItxLlHwliH9t"
                  onChange={(val: string | null) => setToken(val)}
                />
                {message && <p className="text-red-500 text-sm">{message}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg transition disabled:opacity-50"
                >
                  {loading ? "Registering..." : "Register as Provider"}
                </button>
              </form>
              <p className="text-center mt-2 mb-4">Already have an account? <a href='' className="text-blue-500">Login</a></p>
          <p className="text-sm text-justify tracking-normal leading-relaxed mb-2">
            By signing in you agree to our user <a className="text-blue-500">agreement</a> and <a className="text-blue-500">privacy policy.</a></p>
  <p className="text-base  tracking-normal leading-relaxed mb-2"><strong>Kindly Note:</strong> we solely accept agencies that are recognized as legitimate and professional. To assess the eligibility of your profile for publication on TrueFirms, we will conduct a review of your website, 
    portfolio, online reputation, and reviews.</p>
          
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
