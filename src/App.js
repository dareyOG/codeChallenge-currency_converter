import { useEffect, useState } from 'react';

export default function App() {
  const [inValue, setInValue] = useState('');
  const [currFrom, setcurrFrom] = useState('USD');
  const [currTo, setCurrTo] = useState('EUR');
  const [outValue, setOutValue] = useState('');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(
    function () {
      const controller = new AbortController();

      setIsLoading(true);

      async function convertAmount() {
        try {
          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${inValue}&from=${currFrom}&to=${currTo}`,
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error('🚫');

          const data = await res.json();

          setOutValue(data.rates[currTo]);
          setDate(data.date);
        } catch (err) {
          if (currFrom === currTo) {
            setOutValue(inValue);
            setError('');
          }
        } finally {
          setIsLoading(false);
        }
      }

      convertAmount();

      return function () {
        controller.abort();
      };
    },
    [inValue, currFrom, currTo]
  );
  return (
    <div>
      <input
        type="text"
        value={inValue}
        placeholder="input value"
        onChange={e => {
          setInValue(+e.target.value);
        }}
      />

      <select
        value={currFrom}
        onChange={e => setcurrFrom(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
        <option value="JPY">JPY</option>
      </select>

      <select
        value={currTo}
        onChange={e => setCurrTo(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
        <option value="JPY">JPY</option>
      </select>
      {error ? (
        <ErrorMesage />
      ) : isLoading ? (
        <LoadMessage />
      ) : (
        <h4>
          {inValue ? (
            <>
              {outValue} {currTo} | {date}
            </>
          ) : (
            0
          )}
        </h4>
      )}
    </div>
  );
}

function ErrorMesage({ message }) {
  return <div>{message}</div>;
}

function LoadMessage() {
  return <h5>Please wait...</h5>;
}
