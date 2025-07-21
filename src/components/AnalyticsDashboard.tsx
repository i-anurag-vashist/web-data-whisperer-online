import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, BarChart3, TrendingUp, GitCompareIcon, Mail, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { MultiSelect } from './MultiSelect';
import amazonLogo from '@/assets/amazon-logo.svg';

// Metric definitions
const SCORECARD_METRICS = {
  'Topline TXN Scorecard': [
    'APIPL_TXN_APP_SHARE',
    'PAY_TXN_APP_SHARE',
    'EUC_TXN_APP_SHARE',
    'EUC_CORE_TXN_APP_SHARE',
    'GC_CORPRET_TXN_APP_SHARE',
    'GC_INTERNAL_TXN_APP_SHARE',
    'STORES_APP_TXN_APP_SHARE',
    'ACQUIRING_APP_TXN_SHARE',
    'ACQUIRING_PROSTORES3P_TXN_APP_SHARE',
    'CQUIRING_SHOPPING3P_TXN_APP_SHARE',
    'STORES_APP_TXN_SHARE'
  ],
  'Topline TPV Scorecard': [
    'APIPL_TPV_APP_SHARE',
    'PAY_TPV_APP_SHARE',
    'EUC_TPV_APP_SHARE',
    'EUC_CORE_TPV_APP_SHARE',
    'GC_CORPRET_TPV_APP_SHARE',
    'GC_INTERNAL_TPV_APP_SHARE',
    'STORES_APP_TPV_APP_SHARE',
    'ACQUIRING_TPV_APP_SHARE',
    'ACQUIRING_PROSTORES3P_TPV_APP_SHARE',
    'ACQUIRING_SHOPPING3P_TPV_APP_SHARE',
    'STORES_TPV_APP_SHARE'
  ]
};

const DIMENSIONS = ['Overall', 'Use_case', 'Sub_usecase'];

export const AnalyticsDashboard = () => {
  const [selectedScorecard, setSelectedScorecard] = useState<string>('');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>(['Overall']);
  const [userEmail, setUserEmail] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [compareStartDate, setCompareStartDate] = useState<Date>();
  const [compareEndDate, setCompareEndDate] = useState<Date>();
  const [enableComparison, setEnableComparison] = useState(false);

  const handleScorecardChange = (value: string) => {
    setSelectedScorecard(value);
    setSelectedMetrics([]); // Reset metrics when scorecard changes
  };

  const handleAnalyze = () => {
    if (!selectedScorecard || selectedMetrics.length === 0 || !startDate || !endDate || !userEmail) {
      alert('Please fill in all required fields including email');
      return;
    }

    if (enableComparison && (!compareStartDate || !compareEndDate)) {
      alert('Please select comparison dates');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    // Here you would normally send the data to your backend
    console.log('Analysis Parameters:', {
      scorecard: selectedScorecard,
      metrics: selectedMetrics,
      dimensions: selectedDimensions,
      userEmail: userEmail,
      periodStart: startDate,
      periodEnd: endDate,
      compareStart: compareStartDate,
      compareEnd: compareEndDate,
      enableComparison
    });

    alert(`Analysis request submitted! Results will be sent to ${userEmail} (Backend integration needed)`);
  };

  const getAvailableMetrics = () => {
    return selectedScorecard ? SCORECARD_METRICS[selectedScorecard as keyof typeof SCORECARD_METRICS] || [] : [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header with Amazon Branding */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <img src={amazonLogo} alt="Amazon" className="h-12 w-auto" />
            <div className="h-8 w-px bg-muted-foreground/30"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Score Card Builder
                </h1>
                <p className="text-muted-foreground">
                  Powered by Amazon Pay BI Team
                </p>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground text-lg whitespace-nowrap overflow-hidden text-ellipsis">
            Compare metrics across different time periods, dimensions & regions
            with comprehensive analysis
          </p>
        </div>

        {/* Main Form */}
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-full bg-primary/20">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              Analysis Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {/* User Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-base font-semibold flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-primary" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email for results notification"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="text-base h-12"
              />
              <p className="text-sm text-muted-foreground">
                Analysis results will be sent to this email address
              </p>
            </div>

            {/* Row 1: Scorecard Selection */}
            <div className="space-y-2">
              <Label
                htmlFor="scorecard"
                className="text-base font-semibold flex items-center gap-2"
              >
                <Zap className="h-4 w-4 text-primary" />
                Scorecard Name *
              </Label>
              <Select
                value={selectedScorecard}
                onValueChange={handleScorecardChange}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select scorecard name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Topline TXN Scorecard">
                    Topline TXN Scorecard
                  </SelectItem>
                  <SelectItem value="Topline TPV Scorecard">
                    Topline TPV Scorecard
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Row 2: Metrics Multi-Selection */}
            <div className="space-y-2">
              <Label className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Select Metrics * (Multiple Selection Available)
              </Label>
              <MultiSelect
                options={getAvailableMetrics()}
                selected={selectedMetrics}
                onSelectionChange={setSelectedMetrics}
                placeholder="Select metrics to analyze"
                disabled={!selectedScorecard}
              />
              <p className="text-sm text-muted-foreground">
                {selectedMetrics.length > 0
                  ? `${selectedMetrics.length} metric${
                      selectedMetrics.length > 1 ? "s" : ""
                    } selected`
                  : "Select one or more metrics based on your scorecard choice"}
              </p>
            </div>

            {/* Row 3: Dimensions Multi-Selection */}
            <div className="space-y-2">
              <Label className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Dimensions (Multiple Selection Available)
              </Label>
              <MultiSelect
                options={DIMENSIONS}
                selected={selectedDimensions}
                onSelectionChange={setSelectedDimensions}
                placeholder="Select dimensions for analysis"
              />
              <p className="text-sm text-muted-foreground">
                {selectedDimensions.length > 0
                  ? `${selectedDimensions.length} dimension${
                      selectedDimensions.length > 1 ? "s" : ""
                    } selected`
                  : "Choose how to break down your analysis"}
              </p>
            </div>

            {/* Primary Date Range */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-l-4 border-primary pl-4">
                Primary Analysis Period
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12 text-base",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-3 h-5 w-5" />
                        {startDate
                          ? format(startDate, "PPP")
                          : "Pick start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12 text-base",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-3 h-5 w-5" />
                        {endDate ? format(endDate, "PPP") : "Pick end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Comparison Toggle */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-accent/10 rounded-lg">
                <input
                  type="checkbox"
                  id="enableComparison"
                  checked={enableComparison}
                  onChange={(e) => setEnableComparison(e.target.checked)}
                  className="w-5 h-5 text-primary bg-background border-2 border-muted rounded focus:ring-primary focus:ring-2"
                />
                <Label
                  htmlFor="enableComparison"
                  className="text-base font-medium flex items-center gap-2 cursor-pointer"
                >
                  <GitCompareIcon className="h-5 w-5 text-primary" />
                  Enable Period Comparison Analysis
                </Label>
              </div>

              {/* Comparison Date Range */}
              {enableComparison && (
                <div className="space-y-4 p-6 bg-gradient-to-r from-accent/10 to-primary/5 rounded-lg border border-accent/20">
                  <h3 className="text-lg font-semibold border-l-4 border-accent pl-4">
                    Comparison Period
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-base font-medium">
                        Compare Start Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-12 text-base",
                              !compareStartDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-3 h-5 w-5" />
                            {compareStartDate
                              ? format(compareStartDate, "PPP")
                              : "Pick start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={compareStartDate}
                            onSelect={setCompareStartDate}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-medium">
                        Compare End Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-12 text-base",
                              !compareEndDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-3 h-5 w-5" />
                            {compareEndDate
                              ? format(compareEndDate, "PPP")
                              : "Pick end date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={compareEndDate}
                            onSelect={setCompareEndDate}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                onClick={handleAnalyze}
                size="lg"
                className="px-12 py-6 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <BarChart3 className="mr-3 h-5 w-5" />
                Generate Scorecard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Backend Integration Notice */}
        {/* <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Ready for Backend Integration</h3>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                To process your CSV data and send analysis results via email, connect your Supabase backend 
                by clicking the green Supabase button in the top right corner.
              </p>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};