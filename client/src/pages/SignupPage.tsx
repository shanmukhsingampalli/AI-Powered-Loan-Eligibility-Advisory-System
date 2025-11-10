import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Fixed import
import { useAuth } from "../context/AuthContext";
import { Brain, ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [additionalIncomes, setAdditionalIncomes] = useState<
    Array<{ name: string; amount: string }>
  >([]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    gender: "",
    age: "",
    education: "",
    maritalStatus: "",
    dependents: "",
    nationality: "",
    jobTitle: "",
    yearsOfEmployment: "",
    annualSalary: "",
    collateralValue: "",
    employmentType: "private" as
      | "government"
      | "private"
      | "startup"
      | "contract_based"
      | "unemployed",
    previousLoans: false,
    previousLoansStatus: "",
    previousLoanAmount: "",
    totalEmiAmount: "",
    savingBankBalance: "",
    loanPurpose: "",
    loanAmount: "",
    repaymentTermMonths: "",
    numberOfCreditCards: "",
    averageCreditUtilization: "",
    latePaymentHistory: false,
    loanInsurance: false,
  });

  // ✅ Input change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    setError("");
  };

  // ✅ Validation logic for each step
  const validateStep = (): boolean => {
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError("All fields are required.");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return false;
      }
    }

    if (step === 2) {
      if (Number(formData.age) <= 0) {
        setError("Age must be greater than zero.");
        return false;
      }
      if (Number(formData.dependents) < 0) {
        setError("Dependents cannot be negative.");
        return false;
      }
    }

    if (step === 3) {
      if (Number(formData.annualSalary) < 0) {
        setError("Annual salary cannot be negative.");
        return false;
      }
      if (Number(formData.collateralValue) < 0) {
        setError("Collateral value cannot be negative.");
        return false;
      }
      if (
        formData.employmentType === "contract_based" &&
        formData.yearsOfEmployment === ""
      ) {
        setError("Please enter years of employment for contract-based jobs.");
        return false;
      }
    }

    if (step === 4 && formData.previousLoans) {
      if (!formData.previousLoansStatus) {
        setError("Select previous loan status.");
        return false;
      }
      if (!formData.previousLoanAmount) {
        setError("Enter previous loan amount.");
        return false;
      }
    }

    if (step === 5) {
      if (!formData.loanAmount || Number(formData.loanAmount) <= 0) {
        setError("Enter valid loan amount.");
        return false;
      }
    }

    return true;
  };

  // ✅ Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    if (step < 7) {
      setStep(step + 1);
    } else {
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        age: Number(formData.age),
        dependents: Number(formData.dependents),
        yearsOfEmployment: Number(formData.yearsOfEmployment) || 0,
        annualSalary: Number(formData.annualSalary),
        collateralValue: Number(formData.collateralValue),
        previousLoanAmount: Number(formData.previousLoanAmount) || 0,
        totalEmiAmount: Number(formData.totalEmiAmount) || 0,
        savingBankBalance: Number(formData.savingBankBalance),
        loanAmount: Number(formData.loanAmount),
        repaymentTermMonths: Number(formData.repaymentTermMonths),
        numberOfCreditCards: Number(formData.numberOfCreditCards),
        averageCreditUtilization: Number(formData.averageCreditUtilization),
      };
      login(userData);
      navigate("/home");
    }
  };

  // ✅ Manage additional incomes
  const addIncome = () =>
    setAdditionalIncomes([...additionalIncomes, { name: "", amount: "" }]);
  const removeIncome = (index: number) =>
    setAdditionalIncomes(additionalIncomes.filter((_, i) => i !== index));
  const handleIncomeChange = (
    index: number,
    field: "name" | "amount",
    value: string
  ) => {
    const updated = [...additionalIncomes];
    updated[index] = { ...updated[index], [field]: value };
    setAdditionalIncomes(updated);
  };

  // ✅ Step renderer
  const renderStep = () => {
    // Only showing step 1 & 7 example here; the rest of your step code stays unchanged
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="absolute top-4 left-4 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600 mb-6">Step 1 of 7: Authentication</p>

            <div>
              <label className="block mb-2 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        );

      // ✅ Final step example (7)
      case 7:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Credit Information
            </h2>
            <p className="text-gray-600 mb-6">Step 7 of 7: Final Details</p>

            <div>
              <label className="block mb-2 font-medium">
                Number of Credit Cards
              </label>
              <input
                type="number"
                name="numberOfCreditCards"
                value={formData.numberOfCreditCards}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Average Credit Utilization (%)
              </label>
              <input
                type="number"
                name="averageCreditUtilization"
                value={formData.averageCreditUtilization}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // ✅ Final return
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 relative">
        <div className="flex items-center justify-center mb-8">
          <Brain className="w-10 h-10 text-blue-600 mr-3" />
          <span className="text-3xl font-bold text-gray-900">
            LoanAdvisor AI
          </span>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  s <= step
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(step / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {renderStep()}

          <div className="flex space-x-4 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 px-6 py-3 border rounded-lg hover:bg-gray-50"
              >
                <ArrowLeft className="inline w-5 h-5 mr-2" />
                Back
              </button>
            )}
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {step === 7 ? "Complete Signup" : "Next"}
              {step < 7 && <ArrowRight className="inline w-5 h-5 ml-2" />}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
