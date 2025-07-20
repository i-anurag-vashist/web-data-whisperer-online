import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, BarChart3, TrendingUp, GitCompareIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [selectedDimension, setSelectedDimension] = useState<string>('Overall');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [compareStartDate, setCompareStartDate] = useState<Date>();
  const [compareEndDate, setCompareEndDate] = useState<Date>();
  const [enableComparison, setEnableComparison] = useState(false);

  const handleScorecardChange = (value: string) => {
    setSelectedScorecard(value);
    setSelectedMetric(''); // Reset metric when scorecard changes
  };

  const handleAnalyze = () => {
    if (!selectedScorecard || !selectedMetric || !startDate || !endDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (enableComparison && (!compareStartDate || !compareEndDate)) {
      alert('Please select comparison dates');
      return;
    }

    // Here you would normally send the data to your backend
    console.log('Analysis Parameters:', {
      scorecard: selectedScorecard,
      metric: selectedMetric,
      dimension: selectedDimension,
      periodStart: startDate,
      periodEnd: endDate,
      compareStart: compareStartDate,
      compareEnd: compareEndDate,
      enableComparison
    });

    alert('Analysis request submitted! (Backend integration needed)');
  };

  const getAvailableMetrics = () => {
    return selectedScorecard ? SCORECARD_METRICS[selectedScorecard as keyof typeof SCORECARD_METRICS] || [] : [];
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
            <BarChart3 className="text-primary" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Compare metrics across different time periods and dimensions
          </p>
        </div>

        {/* Main Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-primary" />
              Analysis Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Row 1: Scorecard and Metric */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="scorecard">Scorecard Type *</Label>
                <Select value={selectedScorecard} onValueChange={handleScorecardChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scorecard type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Topline TXN Scorecard">Topline TXN Scorecard</SelectItem>
                    <SelectItem value="Topline TPV Scorecard">Topline TPV Scorecard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metric">Select Metric *</Label>
                <Select 
                  value={selectedMetric} 
                  onValueChange={setSelectedMetric}
                  disabled={!selectedScorecard}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableMetrics().map((metric) => (
                      <SelectItem key={metric} value={metric}>
                        {metric}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Dimension */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dimension">Dimension</Label>
                <Select value={selectedDimension} onValueChange={setSelectedDimension}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dimension" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIMENSIONS.map((dimension) => (
                      <SelectItem key={dimension} value={dimension}>
                        {dimension}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 3: Primary Date Range */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Primary Period</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick start date"}
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
                  <Label>End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
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
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enableComparison"
                  checked={enableComparison}
                  onChange={(e) => setEnableComparison(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="enableComparison" className="flex items-center gap-2">
                  <GitCompareIcon className="h-4 w-4" />
                  Enable Date Comparison
                </Label>
              </div>

              {/* Comparison Date Range */}
              {enableComparison && (
                <div className="space-y-4 p-4 bg-accent rounded-lg">
                  <h3 className="text-lg font-semibold">Comparison Period</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Compare Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !compareStartDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {compareStartDate ? format(compareStartDate, "PPP") : "Pick start date"}
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
                      <Label>Compare End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !compareEndDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {compareEndDate ? format(compareEndDate, "PPP") : "Pick end date"}
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
            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleAnalyze}
                size="lg"
                className="px-8"
              >
                Analyze Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card className="bg-accent/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-accent-foreground">Next Steps</h3>
              <p className="text-muted-foreground">
                To enable data processing from your CSV file, please set up the Supabase integration 
                by clicking the green Supabase button in the top right corner.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};