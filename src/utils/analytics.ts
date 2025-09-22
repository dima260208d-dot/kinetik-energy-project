// Analytics utility for tracking website visitors
export interface VisitorData {
  visitorId?: string;
  referrer?: string;
  landingPage?: string;
  currentPage?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
  };
}

export interface AnalyticsResponse {
  success: boolean;
  visitorId: string;
  sessionId: string;
  isNewVisitor: boolean;
  message: string;
  data?: any;
  error?: string;
}

class Analytics {
  private analyticsUrl = 'https://functions.poehali.dev/e7c026e2-103a-4ee0-907d-9d8f3429d921';
  private visitorId: string | null = null;
  private sessionId: string | null = null;

  constructor() {
    // Get or create visitor ID from localStorage
    this.visitorId = localStorage.getItem('kinetic_visitor_id');
    if (!this.visitorId) {
      this.visitorId = this.generateUUID();
      localStorage.setItem('kinetic_visitor_id', this.visitorId);
    }

    // Get or create session ID from sessionStorage
    this.sessionId = sessionStorage.getItem('kinetic_session_id');
    if (!this.sessionId) {
      this.sessionId = this.generateUUID();
      sessionStorage.setItem('kinetic_session_id', this.sessionId);
    }
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private parseUTMParameters(): VisitorData['utm'] {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      source: urlParams.get('utm_source') || undefined,
      medium: urlParams.get('utm_medium') || undefined,
      campaign: urlParams.get('utm_campaign') || undefined,
      content: urlParams.get('utm_content') || undefined,
      term: urlParams.get('utm_term') || undefined,
    };
  }

  async trackVisitor(additionalData?: Partial<VisitorData>): Promise<AnalyticsResponse | null> {
    try {
      const visitorData: VisitorData = {
        visitorId: this.visitorId || undefined,
        referrer: document.referrer || undefined,
        landingPage: window.location.pathname,
        currentPage: window.location.pathname,
        utm: this.parseUTMParameters(),
        ...additionalData
      };

      const response = await fetch(this.analyticsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitorData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: AnalyticsResponse = await response.json();
      
      if (result.success) {
        // Update visitor ID if returned by server
        if (result.visitorId && result.visitorId !== this.visitorId) {
          this.visitorId = result.visitorId;
          localStorage.setItem('kinetic_visitor_id', this.visitorId);
        }
        
        // Update session ID if returned by server
        if (result.sessionId && result.sessionId !== this.sessionId) {
          this.sessionId = result.sessionId;
          sessionStorage.setItem('kinetic_session_id', this.sessionId);
        }
      }

      return result;
    } catch (error) {
      console.error('Analytics tracking error:', error);
      return null;
    }
  }

  async trackPageView(page?: string): Promise<void> {
    await this.trackVisitor({
      currentPage: page || window.location.pathname
    });
  }

  async trackEvent(eventName: string, eventData?: any): Promise<void> {
    await this.trackVisitor({
      currentPage: window.location.pathname,
      utm: {
        ...this.parseUTMParameters(),
        content: eventName,
        term: eventData ? JSON.stringify(eventData) : undefined
      }
    });
  }

  getVisitorId(): string | null {
    return this.visitorId;
  }

  getSessionId(): string | null {
    return this.sessionId;
  }
}

// Create singleton instance
export const analytics = new Analytics();

// Auto-track page view on load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    analytics.trackPageView();
  });
}