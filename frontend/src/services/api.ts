import axios from 'axios';

const API_URL = 'https://bookmyseat-gm9o.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// AUTH APIs

export const signup = async (name: string, email: string, password: string, role: string) => {
  const response = await apiClient.post('/auth/register', { name, email, password, role });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const sendVerificationCode = async (email: string) => {
  const response = await apiClient.post('/auth/send-verification-code', { email });
  return response.data;
};

export const verifyCode = async (email: string, code: string) => {
  const response = await apiClient.post('/auth/verify-code', { email, code });
  return response.data;
};


// EVENTS

export const getAllEvents = async () => (await apiClient.get('/events')).data;
export const getEventById = async (id: number) => (await apiClient.get(`/events/${id}`)).data;
export const createEvent = async (event: any) => (await apiClient.post('/events', event)).data;
export const updateEvent = async (id: number, event: any) => (await apiClient.put(`/events/${id}`, event)).data;
export const deleteEvent = async (id: number) => (await apiClient.delete(`/events/${id}`)).data;


// SEATS

export const getSeatsForEvent = async (eventId: number) => (await apiClient.get(`/seats/event/${eventId}`)).data;
export const addSeat = async (eventId: number, seat: { row: string; number: number }) =>
  (await apiClient.post('/seats', { EventId: eventId, Row: seat.row, Number: seat.number })).data;
export const deleteSeat = async (seatId: number) => (await apiClient.delete(`/seats/${seatId}`)).data;


// BOOKINGS

export const bookSeat = async (eventId: number, seatId: number) =>
  (await apiClient.post('/bookings/book', { eventId, seatId })).data;

export const getMyBookings = async () => (await apiClient.get('/bookings/my')).data;
export const getBookingsForEvent = async (eventId: number) => (await apiClient.get(`/bookings/event/${eventId}`)).data;
export const deleteBooking = async (bookingId: number) => (await apiClient.delete(`/bookings/${bookingId}`)).data;


// USERS

export const getUsers = async () => (await apiClient.get('/users')).data;
export const updateUserRole = async (id: number, role: string) => (await apiClient.put(`/users/${id}/role`, { role })).data;
export const toggleUserActive = async (id: number, isActive: boolean) =>
  (await apiClient.put(`/users/${id}/active`, { isActive })).data;


// PAYMENTS

export const createPaymentIntent = async (bookingId: number, currency: string = 'usd') =>
  (await apiClient.post('/bookings/payment-intent', { bookingId, currency })).data;

export const confirmPayment = async (bookingId: number, paymentIntentId: string) =>
  (await apiClient.post('/bookings/confirm-payment', { bookingId, paymentIntentId })).data;
