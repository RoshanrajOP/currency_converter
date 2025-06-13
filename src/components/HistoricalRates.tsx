import { useState } from 'react';
import { fetchHistoricalRates } from '../services/currencyService';
import { apiCallSubject } from './ApiCounter';

export default function HistoricalRates() {
  const [date, setDate] = useState('');
  const [base, setBase] = useState('USD');
  const [rates, setRates] = useState<Record<string, number>>({});

  const fetch = async () => {
    try {
      const res = await fetchHistoricalRates(date, base);
      apiCallSubject.next();
      setRates(res.quotes);
    } catch (e) {
      alert('Error fetching historical data');
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      <h3 className="text-xl font-bold mb-4">Historical Rates</h3>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border p-2 mr-2" />
      <select value={base} onChange={(e) => setBase(e.target.value)} className="border p-2 mr-2">
        <option>USD</option><option>EUR</option><option>INR</option><option>GBP</option>
      </select>
      <button onClick={fetch} className="bg-blue-500 text-white px-4 py-2 rounded">Fetch</button>
      <div className="mt-4">
        <table className="table-auto w-full text-left">
          <thead><tr><th>Currency</th><th>Rate</th></tr></thead>
          <tbody>
            {Object.entries(rates).map(([k, v]) => (
              <tr key={k}><td>{k}</td><td>{v}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
