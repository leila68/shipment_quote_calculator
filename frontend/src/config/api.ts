const API_BASE_URL = import.meta.env.PROD 
  ? 'https://shipment-quote-calculator-backend.onrender.com/api'
  : '/api';

export default API_BASE_URL;