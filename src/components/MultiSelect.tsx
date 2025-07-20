import React, { useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onSelectionChange,
  placeholder = "Select options...",
  disabled = false
}) => {
  const [open, setOpen] = useState(false);

  const toggleOption = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    onSelectionChange(newSelected);
  };

  const selectAll = () => {
    onSelectionChange(options);
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  const removeSelected = (option: string) => {
    onSelectionChange(selected.filter(item => item !== option));
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between min-h-[2.5rem] h-auto",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <div className="flex flex-wrap gap-1 max-w-full">
              {selected.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : selected.length <= 3 ? (
                selected.map((option) => (
                  <Badge
                    key={option}
                    variant="secondary"
                    className="text-xs bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {option}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSelected(option);
                      }}
                    />
                  </Badge>
                ))
              ) : (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {selected.length} selected
                </Badge>
              )}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="p-2 space-y-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAll}
                className="flex-1 text-xs"
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="flex-1 text-xs"
              >
                Clear All
              </Button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <div
                  key={option}
                  className={cn(
                    "flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer",
                    selected.includes(option) && "bg-accent"
                  )}
                  onClick={() => toggleOption(option)}
                >
                  <div className="flex items-center justify-center w-4 h-4 border border-input rounded">
                    {selected.includes(option) && (
                      <Check className="h-3 w-3 text-primary" />
                    )}
                  </div>
                  <span className="text-sm">{option}</span>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};