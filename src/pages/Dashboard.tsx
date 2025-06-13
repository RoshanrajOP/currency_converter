import React, { useEffect, useState } from 'react';
import {
  fetchCurrencyList,
  fetchLiveRates,
  fetchHistoricalRates,
} from '../services/currencyService';
import '../Dashboard.css';

const Dashboard: React.FC = () => {
  const [apiCallCount, setApiCallCount] = useState(0);
  const [currencies, setCurrencies] = useState<Record<string, string>>({});
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('INR');
  const [amount, setAmount] = useState<number | null>(0);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [selectedDate, setSelectedDate] = useState('');
  const [historicalRates, setHistoricalRates] = useState<Record<string, number>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const cachedCurrencies = localStorage.getItem('currencies');
        if (cachedCurrencies) {
          setCurrencies(JSON.parse(cachedCurrencies));
          return;
        }

        const data = await fetchCurrencyList();
        if (data.success && data.currencies) {
          setCurrencies(data.currencies);
          localStorage.setItem('currencies', JSON.stringify(data.currencies));
        } else {
          setErrorMessage('⚠️ Failed to fetch currency list.');
        }
      } catch (error: any) {
        console.error('Error fetching currency list:', error);
        setErrorMessage('⚠️ Unable to load currencies. You may have hit the API limit.');
      }
    };

    loadCurrencies();
  }, []);

  const handleConvert = async () => {
    try {
      const data = await fetchLiveRates(sourceCurrency);
      if (data.success) {
        const rateKey = `${sourceCurrency}${targetCurrency}`;
        const rate = data.quotes[rateKey];
        if (rate && amount !== null) {
          setConvertedAmount(amount * rate);
        } else {
          setConvertedAmount(null);
        }
        setApiCallCount((prev) => prev + 1);
        setErrorMessage(null);
      } else {
        setErrorMessage('⚠️ ' + (data.error?.info || 'Conversion failed due to rate limit.'));
      }
    } catch (error: any) {
      console.error('Conversion error:', error);
      setErrorMessage('⚠️ API limit exceeded or network error.');
    }
  };

  const handleFetchHistorical = async () => {
    try {
      const data = await fetchHistoricalRates(selectedDate, baseCurrency);
      if (data.success) {
        setHistoricalRates(data.quotes);
        setApiCallCount((prev) => prev + 1);
        setErrorMessage(null);
      } else {
        setErrorMessage('⚠️ ' + (data.error?.info || 'Historical data failed.'));
      }
    } catch (error: any) {
      console.error('Historical rates error:', error);
      setErrorMessage('⚠️ API limit exceeded or network error.');
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Currency Converter</h1>

      <div className="api-section">
        <h2 className="text-md font-semibold">API Call Counter</h2>
        <div className="api-counter">{apiCallCount}</div>
      </div>

      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      {/* Currency Converter */}
      <div className="section-box">
        <h2>Convert</h2>
        <div className="converter-controls">
          <select value={sourceCurrency} onChange={(e) => setSourceCurrency(e.target.value)}>
            {Object.entries(currencies).map(([code, name]) => (
              <option key={code} value={code}>{code} - {name}</option>
            ))}
          </select>

          <select value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value)}>
            {Object.entries(currencies).map(([code, name]) => (
              <option key={code} value={code}>{code} - {name}</option>
            ))}
          </select>

          <input
            type="number"
            min="0"
            placeholder="0"
            value={amount === 0 || amount === null ? '' : amount}
            onFocus={(e) => {
              if (amount === 0 || amount === null) {
                setAmount(null);
              }
            }}
            onBlur={(e) => {
              if (e.target.value === '') {
                setAmount(0);
              }
            }}
            onChange={(e) => {
              const value = e.target.value;
              setAmount(value === '' ? null : Number(value));
            }}
          />

          <button onClick={handleConvert}>Convert</button>
        </div>

        {convertedAmount !== null && (
          <p className="converted-result">
            {amount} {sourceCurrency} = <strong>{convertedAmount.toFixed(2)} {targetCurrency}</strong>
          </p>
        )}
      </div>

      {/* Historical Exchange Rates */}
      <div className="section-box">
        <h2>Historical Exchange Rates</h2>

        <select value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)}>
          {Object.entries(currencies).map(([code, name]) => (
            <option key={code} value={code}>{code} - {name}</option>
          ))}
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <button onClick={handleFetchHistorical}>Fetch</button>

        {Object.keys(historicalRates).length > 0 && (
          <div className="table-container">
            <table className="historical-table">
              <thead>
                <tr>
                  <th>Currency</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(historicalRates).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key.replace(baseCurrency, '')}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
