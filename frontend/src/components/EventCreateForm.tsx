import React from 'react';
import { createEvent } from '../services/api';
import EventForm from './EventForm';

interface EventCreateFormProps {
  onEventCreated?: () => void;
}

const EventCreateForm: React.FC<EventCreateFormProps> = ({ onEventCreated }) => {
  const handleSubmit = async (values: { name: string; description: string; date: string; location: string; price: number }) => {
    const isoDate = values.date ? new Date(values.date).toISOString() : '';
    await createEvent({ ...values, date: isoDate });
    if (onEventCreated) onEventCreated();
  };

  return (
    <EventForm
      onSubmit={handleSubmit}
      onSuccess={onEventCreated}
      submitLabel="Create Event"
      title="Create New Event"
    />
  );
};

export default EventCreateForm;
