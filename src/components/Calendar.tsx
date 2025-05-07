
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { cn } from '@/lib/utils';

interface CalendarProps {
  onDateSelect: (date: Date) => void;
  highlightDates?: Date[];
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, highlightDates = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Get start of current week
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  
  // Generate days of current week
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };
  
  const isDateHighlighted = (date: Date) => {
    return highlightDates.some(highlightDate => 
      highlightDate.toDateString() === date.toDateString()
    );
  };
  
  const previousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };
  
  const nextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CalendarIcon size={18} />
            <h3 className="text-lg font-medium">
              {format(weekStart, 'MMMM yyyy')}
            </h3>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={previousWeek}>
              <ChevronLeftIcon size={16} />
            </Button>
            <Button variant="outline" size="icon" onClick={nextWeek}>
              <ChevronRightIcon size={16} />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-xs font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
          
          {days.map((day, idx) => {
            const isSelected = selectedDate && 
              selectedDate.toDateString() === day.toDateString();
            const isHighlighted = isDateHighlighted(day);
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
              <Button
                key={idx}
                variant="ghost"
                className={cn(
                  "h-10 w-full rounded-md",
                  isToday && "border border-primary/50",
                  isSelected && "bg-primary text-primary-foreground",
                  isHighlighted && !isSelected && "bg-primary/20"
                )}
                onClick={() => handleDateClick(day)}
              >
                <time dateTime={format(day, 'yyyy-MM-dd')}>
                  {format(day, 'd')}
                </time>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Calendar;
