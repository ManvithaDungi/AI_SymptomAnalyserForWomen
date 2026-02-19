import DisclaimerBanner from '../components/DisclaimerBanner';

export default function JournalScreen() {
  return (
    <div className="min-h-full pb-20 pt-8 animate-fade-in">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-text-primary mb-2 tracking-tight">My Journal</h2>
        <p className="text-text-secondary mb-8 text-lg">Track your health journey over time.</p>

        <DisclaimerBanner />

        <div className="glass-card p-12 text-center mt-8">
          <div className="text-6xl mb-6">📔</div>
          <p className="text-text-primary text-xl font-bold mb-2">Your symptom logs will appear here</p>
          <p className="text-text-secondary">Start tracking by analyzing your symptoms.</p>
        </div>
      </div>
    </div>
  );
}
