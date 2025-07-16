import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Change to your backend URL

export const signup = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

export const getEventById = async (id: number) => {
  const response = await axios.get(`${API_URL}/events/${id}`);
  return response.data;
};

export const getSeatsForEvent = async (eventId: number) => {
  const response = await axios.get(`${API_URL}/seats/event/${eventId}`);
  return response.data;
};

export const bookSeat = async (eventId: number, seatId: number) => {
  const response = await axios.post(`${API_URL}/bookings/book`, { eventId, seatId });
  return response.data;
};

export const getMyBookings = async () => {
  const response = await axios.get(`${API_URL}/bookings/my`);
  return response.data;
};

export const getAllEvents = async () => {
  const response = await axios.get(`${API_URL}/events`);
  return response.data;
};

export const createEvent = async (event: { name: string; description: string; date: string; location: string }) => {
  const response = await axios.post(`${API_URL}/events`, event);
  return response.data;
};

export const updateEvent = async (id: number, event: { name: string; description: string; date: string; location: string }) => {
  const response = await axios.put(`${API_URL}/events/${id}`, event);
  return response.data;
};

export const deleteEvent = async (id: number) => {
  const response = await axios.delete(`${API_URL}/events/${id}`);
  return response.data;
};

export const addSeatToEvent = async (eventId: number, seat: { row: string; number: number }) => {
  const response = await axios.post(`${API_URL}/seats`, { eventId, ...seat });
  return response.data;
};

export const deleteSeat = async (seatId: number) => {
  const response = await axios.delete(`${API_URL}/seats/${seatId}`);
  return response.data;
};

export const getBookingsForEvent = async (eventId: number) => {
  const response = await axios.get(`${API_URL}/bookings/event/${eventId}`);
  return response.data;
};

export const deleteBooking = async (bookingId: number) => {
  const response = await axios.delete(`${API_URL}/bookings/${bookingId}`);
  return response.data;
}; 