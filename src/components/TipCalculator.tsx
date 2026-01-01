import { useState, useEffect } from "react";
import { Users, Calculator, RotateCcw, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateTip, checkHealth } from "@/lib/api";

// Tip percentage options
const TIP_OPTIONS = [10, 12, 15, 18, 20];

interface Results {
  tipAmount: number;
  totalWithTip: number;
  amountPerPerson: number;
}

const TipCalculator = () => {
  // State management
  const [billAmount, setBillAmount] = useState("");
  const [tipPercent, setTipPercent] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [results, setResults] = useState<Results | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);

  // Check backend connection on mount
  useEffect(() => {
    checkHealth().then(setBackendConnected);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Get current tip percentage (from preset or custom)
  const getCurrentTip = (): number | null => {
    if (tipPercent !== null) return tipPercent;
    if (customTip && !isNaN(parseFloat(customTip))) return parseFloat(customTip);
    return null;
  };

  // Validate all inputs
  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate bill amount
    if (!billAmount) {
      newErrors.bill = "Please enter the bill amount";
    } else if (parseFloat(billAmount) <= 0) {
      newErrors.bill = "Bill must be greater than 0";
    }

    // Validate tip percentage
    const currentTip = getCurrentTip();
    if (currentTip === null) {
      newErrors.tip = "Please select or enter a tip percentage";
    } else if (currentTip < 0) {
      newErrors.tip = "Tip cannot be negative";
    }

    // Validate number of people
    if (!numberOfPeople) {
      newErrors.people = "Please enter number of people";
    } else if (parseInt(numberOfPeople) <= 0) {
      newErrors.people = "Must be at least 1 person";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate tip and totals using backend API
  const handleCalculate = async () => {
    if (!validateInputs()) return;

    setIsCalculating(true);

    try {
      const bill = parseFloat(billAmount);
      const tip = getCurrentTip()!;
      const people = parseInt(numberOfPeople);

      // Use backend API to calculate and save
      const result = await calculateTip({
        billAmount: bill,
        tipPercent: tip,
        numberOfPeople: people,
      });

      setResults({
        tipAmount: result.tipAmount,
        totalWithTip: result.totalWithTip,
        amountPerPerson: result.amountPerPerson,
      });

      // Verify backend connection
      const isConnected = await checkHealth();
      setBackendConnected(isConnected);
    } catch (error) {
      console.error("Calculation error:", error);
      // Fallback to client-side calculation if backend fails
      const bill = parseFloat(billAmount);
      const tip = getCurrentTip()!;
      const people = parseInt(numberOfPeople);

      const tipAmount = Math.round(bill * (tip / 100) * 100) / 100;
      const totalWithTip = Math.round((bill + tipAmount) * 100) / 100;
      const amountPerPerson = Math.round((totalWithTip / people) * 100) / 100;

      setResults({
        tipAmount,
        totalWithTip,
        amountPerPerson,
      });

      setBackendConnected(false);
    } finally {
      setIsCalculating(false);
    }
  };

  // Reset all fields
  const handleReset = () => {
    setBillAmount("");
    setTipPercent(null);
    setCustomTip("");
    setNumberOfPeople("");
    setResults(null);
    setErrors({});
  };

  // Handle tip preset selection
  const handleTipSelect = (percent: number) => {
    setTipPercent(percent);
    setCustomTip("");
    setErrors((prev) => ({ ...prev, tip: "" }));
  };

  // Handle custom tip input
  const handleCustomTipChange = (value: string) => {
    setCustomTip(value);
    setTipPercent(null);
    setErrors((prev) => ({ ...prev, tip: "" }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
      <Card className="w-full max-w-md shadow-2xl border-0 backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center pb-2">
          {/* Dark mode toggle */}
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full hover:bg-muted transition-all duration-200"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-foreground" />
              ) : (
                <Moon className="h-5 w-5 text-foreground" />
              )}
            </Button>
          </div>

          {/* Backend connection status */}
          {backendConnected !== null && (
            <div className="absolute top-4 left-4">
              <div
                className={`w-3 h-3 rounded-full ${
                  backendConnected ? "bg-green-500" : "bg-yellow-500"
                }`}
                title={
                  backendConnected
                    ? "Backend connected"
                    : "Backend offline - using local calculation"
                }
              />
            </div>
          )}

          <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
            Welcome to the
            <span className="block text-primary mt-1">Tip Calculator</span>
          </CardTitle>
          <p className="text-muted-foreground text-sm mt-2">
            Split bills easily with friends!
          </p>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Bill Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Bill Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">₹</span>
              <Input
                type="number"
                placeholder="0.00"
                value={billAmount}
                onChange={(e) => {
                  setBillAmount(e.target.value);
                  setErrors((prev) => ({ ...prev, bill: "" }));
                }}
                className="pl-10 h-12 text-lg bg-background border-input focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {errors.bill && (
              <p className="text-destructive text-xs animate-fade-in">{errors.bill}</p>
            )}
          </div>

          {/* Tip Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Select Tip %
            </label>
            <div className="grid grid-cols-5 gap-2">
              {TIP_OPTIONS.map((percent) => (
                <Button
                  key={percent}
                  variant={tipPercent === percent ? "default" : "outline"}
                  onClick={() => handleTipSelect(percent)}
                  className={`h-11 font-semibold transition-all duration-200 hover:scale-105 ${
                    tipPercent === percent
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-background hover:bg-muted"
                  }`}
                >
                  {percent}%
                </Button>
              ))}
            </div>
            {/* Custom tip input */}
            <div className="relative mt-2">
              <Input
                type="number"
                placeholder="Custom %"
                value={customTip}
                onChange={(e) => handleCustomTipChange(e.target.value)}
                className="h-11 text-center bg-background border-input focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {errors.tip && (
              <p className="text-destructive text-xs animate-fade-in">{errors.tip}</p>
            )}
          </div>

          {/* Number of People */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Number of People
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="number"
                placeholder="1"
                min="1"
                value={numberOfPeople}
                onChange={(e) => {
                  setNumberOfPeople(e.target.value);
                  setErrors((prev) => ({ ...prev, people: "" }));
                }}
                className="pl-10 h-12 text-lg bg-background border-input focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {errors.people && (
              <p className="text-destructive text-xs animate-fade-in">{errors.people}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="flex-1 h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
            >
              {isCalculating ? (
                <span className="animate-pulse">Calculating...</span>
              ) : (
                <>
                  <Calculator className="mr-2 h-5 w-5" />
                  Calculate
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="h-12 px-4 hover:bg-muted transition-all duration-200 hover:scale-105"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>

          {/* Results Display */}
          {results && (
            <div className="mt-6 space-y-3 animate-slide-up">
              <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                <ResultRow
                  label="Tip Amount"
                  value={results.tipAmount}
                  delay="0ms"
                />
                <ResultRow
                  label="Total with Tip"
                  value={results.totalWithTip}
                  delay="100ms"
                />
                <div className="border-t border-border pt-3">
                  <ResultRow
                    label="Per Person"
                    value={results.amountPerPerson}
                    isHighlighted
                    delay="200ms"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Result row component
interface ResultRowProps {
  label: string;
  value: number;
  isHighlighted?: boolean;
  delay?: string;
}

const ResultRow = ({ label, value, isHighlighted = false, delay = "0ms" }: ResultRowProps) => (
  <div
    className="flex justify-between items-center"
    style={{ animationDelay: delay }}
  >
    <span className={`${isHighlighted ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
      {label}
    </span>
    <span
      className={`font-bold ${
        isHighlighted ? "text-xl text-primary" : "text-lg text-foreground"
      }`}
    >
      ₹{value.toFixed(2)}
    </span>
  </div>
);

export default TipCalculator;

