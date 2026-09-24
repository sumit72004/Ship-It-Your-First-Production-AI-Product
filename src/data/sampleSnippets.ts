import { PresetSnippet } from "../types/accessibility";

export const SAMPLE_SNIPPETS: PresetSnippet[] = [
  {
    id: "unlabelled-form",
    title: "Inaccessible Login Form",
    category: "Forms & Inputs",
    description: "Inputs lack explicit <label> associations, icon button has no accessible text, and validation error is invisible to screen readers.",
    code: `<!-- Problematic Form Example -->
<form class="login-box">
  <div class="header">Sign In</div>
  
  <!-- Missing label association -->
  <input type="email" placeholder="Enter your email" />
  
  <!-- Missing label and type attribute -->
  <input placeholder="Password" />
  
  <!-- Visual error not associated with input or announced to assistive tech -->
  <span style="color: red; font-size: 11px;">Password must be at least 8 characters</span>
  
  <div class="checkbox-container">
    <input type="checkbox" />
    <span>Remember me</span>
  </div>

  <!-- Icon-only submit button with zero accessible text -->
  <button class="submit-btn" style="background: #999; color: #fff;">
    <svg width="18" height="18" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
  </button>
</form>`
  },
  {
    id: "inaccessible-modal",
    title: "Fake Div Dialog / Modal",
    category: "Interactive Components",
    description: "A pop-up modal built with <div> tags, lacking role='dialog', aria-modal, focus trapping, and keyboard dismissal.",
    code: `<!-- Non-semantic Modal -->
<div class="modal-backdrop" onclick="closeModal()">
  <div class="modal-window">
    <div class="modal-title">Delete Account Confirmation</div>
    <p style="color: #888888;">Are you sure you want to permanently delete your workspace? This action cannot be undone.</p>
    
    <div class="actions">
      <!-- Non-button clickable elements -->
      <span class="btn cancel-btn" onclick="closeModal()">Cancel</span>
      <span class="btn delete-btn" onclick="confirmDelete()">Delete Now</span>
    </div>
    
    <!-- Non-accessible close icon -->
    <div class="close-icon" onclick="closeModal()">✕</div>
  </div>
</div>`
  },
  {
    id: "icon-button-toolbar",
    title: "Action Toolbar with Missing Names",
    category: "Navigation & Controls",
    description: "Buttons without accessible names, tabindex='3' disrupting natural tab order, and active states convey info only via color.",
    code: `<!-- Inaccessible Toolbar -->
<div class="toolbar" role="group">
  <!-- Tabindex greater than 0 is an anti-pattern -->
  <button tabindex="3" class="active-item" style="border: 2px solid red;">
    <svg width="20" height="20" fill="currentColor"><path d="M3 3h18v18H3z"/></svg>
  </button>
  
  <button tabindex="2">
    <svg width="20" height="20" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
  </button>
  
  <button tabindex="1">
    <svg width="20" height="20" fill="currentColor"><path d="M12 2l10 18H2L12 2z"/></svg>
  </button>

  <!-- Interactive element hidden from keyboard users -->
  <div onclick="shareContent()" style="cursor: pointer; display: inline-block;">
    Share
  </div>
</div>`
  },
  {
    id: "low-contrast-card",
    title: "Low Contrast Media Card",
    category: "Color & Typography",
    description: "Fails WCAG 2.1 AA 4.5:1 contrast requirements, empty alt text on informative image, and no focus outline.",
    code: `<!-- Low Contrast & Ambiguous Card -->
<div class="card" style="outline: none;">
  <!-- Missing or inappropriate alt text -->
  <img src="chart.png" alt="" />
  
  <!-- Fails contrast: light gray text (#a1a1aa) on white background -->
  <p style="color: #a1a1aa; font-size: 13px;">Q3 2024 Financial Overview & Metrics</p>
  
  <div style="color: #6ee7b7; background: #ffffff;">
    Revenue grew by 24% year-over-year.
  </div>
  
  <!-- Generic link text violating WCAG 2.4.4 Link Purpose -->
  <a href="/report" style="color: #93c5fd; text-decoration: none;">Click here</a>
</div>`
  }
];
