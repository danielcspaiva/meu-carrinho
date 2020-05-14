import axios from 'axios';

const service = axios.create({
  baseURL: 'http://localhost:5000/api/v1/order',
  withCredentials: true,
});

export const getOrder = (orderId) => {
  return service
    .get(`/${orderId}`)
    .then((response) => response.data);
};

export const createOrder = (storeId, body) => {
  return service
    .post(`/${storeId}/new`, { ...body })
    .then((response) => response.data);
};

export const updateOrder = (orderId, body) => {
  return service
    .patch(`/update/${orderId}`, { ...body })
    .then((response) => response.data);
};

export const deleteOrder = (storeId, orderId) => {
  return service
    .delete(`/delete/${storeId}/${orderId}`)
    .then((response) => response.data);
};