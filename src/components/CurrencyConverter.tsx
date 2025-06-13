import { useEffect, useState } from 'react';
import { fetchLiveRates } from '../services/currencyService';
import { apiCallSubject } from './ApiCounter';

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const data = await fetchLiveRates();
        apiCallSubject.next();
        const pair = from + to;
        setRate(data.quotes[pair]);
      } catch {
        setRate(null);
      }
    };
    fetchRates();
  }, [from, to]);

  return (
    <div className="bg-white p-4 shadow rounded mb-6">
      <h3 className="text-xl font-bold mb-4">Currency Converter</h3>
      <div className="flex gap-4 mb-2">
        <input type="number" value={amount} onChange={(e) => setAmount(+e.target.value)} className="border p-2" />
        <select value={from} onChange={(e) => setFrom(e.target.value)} className="border p-2">
          <option>USD</option><option>EUR</option><option>INR</option><option>GBP</option>
        </select>
        <span className="self-center">→</span>
        <select value={to} onChange={(e) => setTo(e.target.value)} className="border p-2">
          <option>USD</option><option>EUR</option><option>INR</option><option>GBP</option>
        </select>
      </div>
      {rate && (
        <div className="text-lg mt-2">Converted: {(amount * rate).toFixed(2)} {to}</div>
      )}
    </div>
  );
}
