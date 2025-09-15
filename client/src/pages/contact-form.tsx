import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { COMPANY_INFO, CORPORATE_TEMPLATES } from '@shared/company';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    interest: 'delivery' // delivery, partner, driver, other
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission - in real app, this would send to your backend
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', phone: '', message: '', interest: 'delivery' });
      }, 3000);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div style={{
        background: 'linear-gradient(180deg,#0c1117,#0b1118)',
        border: '1px solid rgba(255,255,255,.06)',
        borderRadius: '16px',
        padding: '32px',
        textAlign: 'center',
        color: '#10d07a'
      }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '20px' }}>Message Sent! 🚀</h3>
        <p style={{ margin: '0', color: '#cbd6df' }}>
          Your message has been sent to {COMPANY_INFO.PARENT_COMPANY}'s {COMPANY_INFO.COMPANY_NAME} team. Our corporate representatives will respond to partnership and business inquiries within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(180deg,#0c1117,#0b1118)',
      border: '1px solid rgba(255,255,255,.06)',
      borderRadius: '16px',
      padding: '24px',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <h3 style={{ margin: '0 0 16px', fontSize: '18px', color: '#eaf2f8' }}>Contact {COMPANY_INFO.PARENT_COMPANY} - {COMPANY_INFO.COMPANY_NAME}</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              background: '#0c1117',
              border: '1px solid rgba(255,255,255,.08)',
              color: '#fff',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '14px'
            }}
            data-testid="input-contact-name"
          />
          
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              background: '#0c1117',
              border: '1px solid rgba(255,255,255,.08)',
              color: '#fff',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '14px'
            }}
            data-testid="input-contact-email"
          />
        </div>
        
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number (Optional)"
          value={formData.phone}
          onChange={handleChange}
          style={{
            background: '#0c1117',
            border: '1px solid rgba(255,255,255,.08)',
            color: '#fff',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '14px'
          }}
          data-testid="input-contact-phone"
        />
        
        <select
          name="interest"
          value={formData.interest}
          onChange={handleChange}
          style={{
            background: '#0c1117',
            border: '1px solid rgba(255,255,255,.08)',
            color: '#fff',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '14px'
          }}
          data-testid="select-contact-interest"
        >
          <option value="delivery">YaadFlex Delivery Services</option>
          <option value="driver">Platform Partnership</option>
          <option value="partner">Corporate Partnership</option>
          <option value="investor">Investor Relations</option>
          <option value="press">Press & Media</option>
          <option value="other">Other</option>
        </select>
        
        <textarea
          name="message"
          placeholder="How can BlackRock's YaadFlex team assist you?"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          style={{
            background: '#0c1117',
            border: '1px solid rgba(255,255,255,.08)',
            color: '#fff',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '14px',
            resize: 'vertical'
          }}
          data-testid="textarea-contact-message"
        />
        
        <Button
          type="submit"
          disabled={isSubmitting}
          style={{
            background: 'linear-gradient(180deg, #10d07a, #07a86e)',
            color: '#08140f',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1
          }}
          data-testid="button-contact-submit"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
      
      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        background: '#0e131a', 
        borderRadius: '8px',
        fontSize: '12px',
        color: '#9fb0c0'
      }}>
        <strong>BlackRock Corporate Contact:</strong><br/>
        🏢 BlackRock, Inc. - 50 Hudson Yards, New York, NY 10001<br/>
        📧 yaadflexglobal@blackrock.com - Corporate partnerships & business development<br/>
        📧 investor-relations@blackrock.com - Investor inquiries<br/>
        📞 +1 (212) 810-5300 - BlackRock Corporate Headquarters<br/>
        🌐 YaadFlex: A BlackRock Portfolio Company
      </div>
    </div>
  );
}