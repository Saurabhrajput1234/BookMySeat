import axios from 'axios';

const API_URL = 'http://localhost:5224/api'; // ✅ Backend API URL

// ✅ Create Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Add interceptor to attach JWT token to every request automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
   console.log('Outgoing API request:', config.url, 'with token:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===========================
// ✅ AUTHENTICATION APIs
// ===========================
export const signup = async (name: string, email: string, password: string, role: string) => {
  const response = await apiClient.post('/auth/register', { name, email, password, role });
  return response.data; // Expected response: { token: string }
};

export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data; // Expected response: { token: string }
};

// ===========================
// ✅ EVENT APIs
// ===========================
export const getAllEvents = async () => {
  const response = await apiClient.get('/events');
  return response.data;
};

export const getEventById = async (id: number) => {
  const response = await apiClient.get(`/events/${id}`);
  return response.data;
};

export const createEvent = async (event: { name: string; description: string; date: string; location: string }) => {
  const response = await apiClient.post('/events', event);
  return response.data;
};

export const updateEvent = async (id: number, event: { name: string; description: string; date: string; location: string }) => {
  const response = await apiClient.put(`/events/${id}`, event);
  return response.data;
};

export const deleteEvent = async (id: number) => {
  const response = await apiClient.delete(`/events/${id}`);
  return response.data;
};

// ===========================
// ✅ SEAT APIs
// ===========================
export const getSeatsForEvent = async (eventId: number) => {
  const response = await apiClient.get(`/seats/event/${eventId}`);
  return response.data;
};

export const addSeatToEvent = async (eventId: number, seat: { row: string; number: number }) => {
  const response = await apiClient.post('/seats', { eventId, ...seat });
  return response.data;
};

export const deleteSeat = async (seatId: number) => {
  const response = await apiClient.delete(`/seats/${seatId}`);
  return response.data;
};

// ===========================
// ✅ BOOKING APIs
// ===========================
export const bookSeat = async (eventId: number, seatId: number) => {
  const response = await apiClient.post('/bookings/book', { eventId, seatId });
  return response.data;
};

export const getMyBookings = async () => {
  const response = await apiClient.get('/bookings/my');
  return response.data;
};

export const getBookingsForEvent = async (eventId: number) => {
  const response = await apiClient.get(`/bookings/event/${eventId}`);
  return response.data;
};

export const deleteBooking = async (bookingId: number) => {
  const response = await apiClient.delete(`/bookings/${bookingId}`);
  return response.data;
};

// ===========================
// ✅ USER MANAGEMENT APIs (Admin Only)
// ===========================
export const getUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};

export const updateUserRole = async (id: number, role: string) => {
  const response = await apiClient.put(`/users/${id}/role`, role, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const toggleUserActive = async (id: number, isActive: boolean) => {
  const response = await apiClient.put(`/users/${id}/active`, isActive, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};
