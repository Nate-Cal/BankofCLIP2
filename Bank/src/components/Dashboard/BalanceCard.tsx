import { useState, useEffect } from 'react';

interface BalanceCardProps {
  balanceCents: number;
}

export function BalanceCard({ balanceCents }: BalanceCardProps) {
  const balanceDollars = balanceCents / 100;
  const [displayBalance, setDisplayBalance] = useState<number>(balanceDollars);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 800; 
    const startValue = displayBalance;
    const endValue = balanceDollars;

    if (startValue === endValue) return;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayBalance(startValue + (endValue - startValue) * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayBalance(endValue); 
      }
    };

    const rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [balanceDollars]);

  return (
    <section className="balance-card flex-card">
      <div className="balance-info">
        <span className="balance-label">Available Balance</span>
        <h2 className="balance-amount">
          ${displayBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
      </div>
      <div className="balance-accent-badge">Checking Account</div>
    </section>
  );
}
