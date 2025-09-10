export default function TinyUpload() {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    alert(`Selected: ${file.name} (${Math.round(file.size/1024)}KB)`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Tiny Upload Test</h1>
      <p>This just shows file info - no actual upload to test if the issue is memory crashes.</p>
      
      <input
        type="file"
        onChange={handleUpload}
        style={{ width: '100%', padding: '10px', marginTop: '10px' }}
      />
      
      <div style={{ 
        background: '#f0f0f0', 
        padding: '10px', 
        marginTop: '10px',
        fontSize: '12px'
      }}>
        Try selecting a file. If this crashes your browser, the issue is with Replit's memory limits.
      </div>
    </div>
  );
}