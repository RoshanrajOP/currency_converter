import { useEffect, useState } from 'react';
import { Subject } from 'rxjs';

export const apiCallSubject = new Subject<void>();

export default function ApiCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sub = apiCallSubject.subscribe(() => setCount((prev) => prev + 1));
    return () => sub.unsubscribe();
  }, []);

  return (
    <div className="text-center text-4xl font-bold text-green-600 mb-6">
      API Calls: {count}
    </div>
  );
}
