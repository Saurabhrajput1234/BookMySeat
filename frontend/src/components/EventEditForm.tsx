import React from 'react';
import { updateEvent } from '../services/api';
import EventForm from './EventForm';

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
  price?: number;
}

interface EventFormValues {
  name: string;
  description: string;
  date: string;
  location: string;
  price: number;
}

interface EventEditFormProps {
  event: Event;
  onEventUpdated?: () => void;
}

const EventEditForm: React.FC<EventEditFormProps> = ({ event, onEventUpdated }) => {
  const handleSubmit = async (values: EventFormValues) => {
    try {
      const isoDate = values.date ? new Date(values.date).toISOString() : '';
      await updateEvent(event.id, { ...values, date: isoDate });
      if (onEventUpdated) onEventUpdated();
    } catch (error) {
      console.error('Failed to update event:', error);
      alert('Failed to update event. Please try again.');
    }
  };

  return (
    <EventForm
      initialValues={{
        name: event.name,
        description: event.description,
        date: event.date ? event.date.substring(0, 16) : '',
        location: event.location,
        price: event.price || 0
      }}
      onSubmit={handleSubmit}
      onSuccess={onEventUpdated}
      submitLabel="Update Event"
      title="Edit Event"
    />
  );
};

export default EventEditForm;
