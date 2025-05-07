
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import RoomCard from '@/components/RoomCard';
import { api } from '@/services/api';
import { Room } from '@/models/types';
import { SearchIcon, XIcon } from 'lucide-react';

const Rooms = () => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [capacityFilter, setCapacityFilter] = useState<string>('all');
  const [featureFilter, setFeatureFilter] = useState<string>('all');
  
  // Fetch rooms
  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: api.getRooms
  });
  
  // Collect all features from rooms for filter options
  const allFeatures = Array.from(
    new Set(
      rooms.flatMap(room => room.features)
    )
  ).sort();
  
  // Apply filters
  const filteredRooms = rooms.filter(room => {
    // Apply search filter
    const matchesSearch = 
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      room.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Apply capacity filter
    let matchesCapacity = true;
    if (capacityFilter !== 'all') {
      const [min, max] = capacityFilter.split('-').map(Number);
      if (max) {
        matchesCapacity = room.capacity >= min && room.capacity <= max;
      } else {
        matchesCapacity = room.capacity >= min;
      }
    }
    
    // Apply feature filter
    let matchesFeature = true;
    if (featureFilter !== 'all') {
      matchesFeature = room.features.includes(featureFilter);
    }
    
    return matchesSearch && matchesCapacity && matchesFeature;
  });
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setCapacityFilter('all');
    setFeatureFilter('all');
  };
  
  // Check if any filters are applied
  const filtersApplied = searchTerm !== '' || capacityFilter !== 'all' || featureFilter !== 'all';
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meeting Rooms</h1>
        <p className="text-muted-foreground">
          Browse and book available meeting rooms
        </p>
      </div>
      
      {/* Filters */}
      <div className="rounded-lg border bg-card p-4">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            {/* Capacity filter */}
            <Select 
              value={capacityFilter} 
              onValueChange={setCapacityFilter}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select capacity" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Capacity</SelectLabel>
                  <SelectItem value="all">Any capacity</SelectItem>
                  <SelectItem value="1-4">Small (1-4 people)</SelectItem>
                  <SelectItem value="5-10">Medium (5-10 people)</SelectItem>
                  <SelectItem value="11-20">Large (11-20 people)</SelectItem>
                  <SelectItem value="21">Extra Large (21+ people)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            {/* Feature filter */}
            <Select 
              value={featureFilter} 
              onValueChange={setFeatureFilter}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select feature" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Features</SelectLabel>
                  <SelectItem value="all">Any features</SelectItem>
                  {allFeatures.map(feature => (
                    <SelectItem key={feature} value={feature}>
                      {feature}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          {/* Clear filters */}
          {filtersApplied && (
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-xs flex items-center gap-1"
              >
                <XIcon size={12} />
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Room cards */}
      {isLoading ? (
        <div className="text-center py-12">Loading rooms...</div>
      ) : filteredRooms.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="font-medium text-lg">No rooms found</h3>
          <p className="text-muted-foreground">Try adjusting your filters</p>
          {filtersApplied && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Rooms;
