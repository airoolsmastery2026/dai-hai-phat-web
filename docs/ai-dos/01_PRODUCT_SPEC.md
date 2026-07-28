# 01_PRODUCT_SPEC.md

## Purpose

Document product requirements, features, user stories, and acceptance criteria for development.

## Table of Contents

1. Product Overview
2. Core Features
3. User Stories
4. Acceptance Criteria
5. Non-Functional Requirements
6. Constraints

## Product Overview

**Product Name**: Đại Hải Phát Website

**Product Type**: Corporate Marketing Website

**Primary Language**: Vietnamese

**Target Market**: Vietnam (with secondary English version)

**Launch Timeline**: Ongoing (MVP deployed, continuous improvement)

## Product Vision

Provide a professional, high-performance digital presence for Đại Hải Phát that attracts, engages, and converts potential customers while establishing the company as a trusted leader in Vietnamese manufacturing and construction.

**Vision Statement**: To be the go-to online source for information about Đại Hải Phát's manufacturing capabilities, construction services, and project portfolio.

## Business Goals

1. **Lead Generation** - Capture qualified inquiries from potential customers via contact forms and calls-to-action
2. **Brand Authority** - Establish credibility through portfolio showcase, company history, and customer testimonials
3. **SEO Visibility** - Rank for high-intent keywords related to manufacturing and construction services in Vietnam
4. **Customer Education** - Provide detailed information about services, capabilities, and past projects
5. **Professional Image** - Communicate company values, team expertise, and commitment to quality
6. **Search Traffic** - Increase organic traffic from Google and local search
7. **Conversion Optimization** - Guide visitors from awareness to inquiry/action
8. **Competitive Differentiation** - Highlight unique capabilities and competitive advantages

## Target Customers

### Primary Audiences

**B2B Customers**
- Manufacturers seeking outsourced production
- Construction companies needing subcontractors
- Enterprise businesses requiring manufacturing solutions
- Project developers seeking construction partners
- Companies in automotive, electronics, machinery industries

**Decision Makers**
- Procurement managers
- Plant managers
- Project managers
- C-level executives (CEO, CTO)
- Facility directors

### Geographic Focus
- Vietnam (primary)
- Regional ASEAN markets (secondary)
- International companies with Vietnam operations (tertiary)

### Psychographics
- Value quality and reliability
- Seek established, trustworthy partners
- Need detailed technical information
- Make decisions based on portfolio and past performance
- Prefer professional, transparent communication

## Services

### Core Service Categories

**1. Manufacturing Services**
- Metal fabrication and machining
- Assembly and production
- Custom manufacturing solutions
- Quality control and testing
- Production management

**2. Construction Services**
- Building construction
- Infrastructure projects
- Renovation and renovation
- Site management
- Project coordination

**3. Engineering Services**
- Technical design
- Process optimization
- Quality assurance
- Safety management
- Consulting

### Service Attributes
- Custom solutions tailored to client needs
- Quality certified production
- Professional project management
- Competitive pricing
- On-time delivery commitment
- Transparency and communication

## Website Goals

### Primary Goals (in priority order)

1. **Capture Inquiries** (Conversion)
   - Generate 50+ qualified inquiries per month
   - Track inquiry source (organic, direct, referral)
   - Enable easy contact request process

2. **Build Credibility** (Trust)
   - Showcase 20+ completed projects with details
   - Display team expertise and certifications
   - Feature customer testimonials/case studies

3. **Organic Search Visibility** (SEO)
   - Rank for 50+ high-intent keywords within 6 months
   - Target: "manufacturing Vietnam", "construction contractors Vietnam", service + location combinations
   - Achieve 70+ domain authority within 12 months

4. **Provide Information** (Education)
   - Detailed service pages with capabilities
   - Project portfolio with images and descriptions
   - Blog content about industry trends and solutions

5. **Mobile Accessibility** (Reach)
   - 90%+ of users access via mobile (Vietnam market)
   - Fast load times (< 3 seconds)
   - Responsive design across all devices

### Secondary Goals

6. **Establish Expertise** (Thought Leadership)
   - Blog articles demonstrating industry knowledge
   - Case studies showing problem-solving capability
   - Team bios highlighting expertise

7. **Enable Easy Communication** (Support)
   - Multiple contact methods (form, phone, email, location)
   - Fast response commitment (24-hour response)
   - Clear service inquiry process

8. **Support Sales Process** (Revenue)
   - Detailed service information supporting sales
   - Portfolio for customer decision-making
   - Pricing/inquiry guidance for prospects

## Sitemap

```
/ (Homepage)
├── /services (Services Hub)
│   ├── /services/manufacturing (Manufacturing Details)
│   ├── /services/construction (Construction Details)
│   └── /services/engineering (Engineering Details)
├── /projects (Project Portfolio)
│   └── /projects/[id] (Individual Project Details)
├── /about (Company Information)
│   ├── /about/company (Company History & Mission)
│   ├── /about/team (Team Members & Expertise)
│   └── /about/gallery (Photo Gallery)
├── /blog (Blog Hub)
│   └── /blog/[slug] (Individual Blog Articles)
├── /contact (Contact Page)
├── /faq (Frequently Asked Questions)
└── /404 (Error Page)

/admin (Admin Dashboard - not public)
├── /admin/blog (Blog Management)
├── /admin/projects (Project Management)
└── /admin/settings (Site Settings)
```

## Homepage Structure

### Homepage Purpose
Introduce company, showcase key value proposition, guide visitors to key sections, capture initial interest.

### Homepage Sections (Top to Bottom)

**1. Hero Section**
- Headline communicating key value proposition
- Subheading with benefit statement
- Large hero image showing manufacturing/construction
- Primary CTA button (Get Started / Request Quote)
- Secondary CTA (Learn More)
- Scroll indicator

**2. Services Overview Section**
- Grid of 3 main service categories
- Icon or image per service
- Short description (2-3 sentences)
- "Learn More" link per service

**3. Why Choose Us Section**
- 4-5 key differentiators or value propositions
- Icons and short explanations
- Examples: Quality, Experience, Reliability, Technology, Support

**4. Featured Projects Section**
- Carousel or grid of 4-6 recent/best projects
- Project image, name, brief description
- "View All Projects" link

**5. Stats/Proof Section**
- Years in business
- Projects completed
- Satisfied customers
- Team members
- (Quantifiable achievements)

**6. Testimonials Section**
- 3-4 customer testimonials
- Customer name, company, quote
- Photo (if available)

**7. Team/Expertise Section**
- Brief intro to company team
- 2-4 key team member photos
- "Meet Our Team" link

**8. Blog Highlights Section**
- 3 recent blog posts
- Title, excerpt, date
- "Read More" or "View All Blog" link

**9. Call-to-Action Section**
- Strong headline ("Ready to Partner?")
- Brief description
- Contact form or CTA button
- Contact information

**10. Footer**
- Company info
- Quick links (Services, Projects, Blog, About, Contact)
- Social media links
- Copyright and legal links

### Homepage Responsive Behavior
- Mobile: Single column, stacked sections
- Tablet: 2-column grid where appropriate
- Desktop: Multi-column layouts with full-width sections
- All sections scrollable and accessible

## Service Page Structure

### Service Hub Page (/services)
- Introduction to company capabilities
- Grid or list of 3 service categories
- Each service links to detailed page
- Call-to-action to contact about specific needs

### Individual Service Page (/services/[service])

**Content Sections:**

1. **Service Hero**
   - Service name as H1
   - Brief description
   - Relevant image
   - CTA ("Request a Quote" / "Get Started")

2. **Service Overview**
   - Detailed description of service
   - Key capabilities list
   - Why this service matters

3. **What We Offer**
   - Detailed list of specific offerings (bulleted or detailed)
   - Description of each offering
   - Industry applications

4. **Process/Workflow**
   - Step-by-step explanation of how service works
   - Visual timeline or process flow
   - Customer involvement points

5. **Specifications/Requirements**
   - Technical capabilities
   - Equipment used
   - Certifications held
   - Quality standards met

6. **Industries We Serve**
   - List of industries/sectors
   - Brief explanation of how we serve each
   - Industry-specific projects (images/links)

7. **Case Studies/Projects**
   - 3-5 examples of this service
   - Project details, results, images
   - Links to full project pages

8. **Advantages/Why Choose Us**
   - 4-5 key differentiators for this service
   - Comparison to alternatives (implicit)
   - Value proposition

9. **FAQ**
   - 5-8 frequently asked questions
   - Clear answers
   - Contact link for complex questions

10. **Related Services**
    - Links to other services
    - Brief description of relationship

11. **Call-to-Action**
    - "Request Quote" form
    - Contact information
    - Response time commitment

## Project Page Structure

### Projects Hub Page (/projects)

**Content:**
- Portfolio introduction
- Grid of all projects (12+ projects)
- Per project: thumbnail image, name, service category, date
- Filter options (by service, by date, by client type)
- Pagination (12 per page)
- Project count summary

### Individual Project Page (/projects/[id])

**Project Information:**

1. **Project Header**
   - Project name (H1)
   - Client name (if shareable)
   - Project date/timeline
   - Service category tag
   - Hero image of completed project

2. **Project Overview**
   - Project description
   - Challenge/problem solved
   - Client background (if shareable)
   - Scale/scope of project

3. **Project Scope**
   - Detailed description of work performed
   - Timeline
   - Deliverables
   - Team involvement

4. **Solution**
   - Detailed explanation of how problem was solved
   - Technical approach
   - Innovation/unique aspects
   - Process used

5. **Results/Outcomes**
   - Quantified results if available
   - Quality improvements
   - Cost savings or efficiency gains
   - Client satisfaction metrics
   - Impact achieved

6. **Project Gallery**
   - 5-10+ high-quality images of project
   - Photos at different stages (planning, execution, completion)
   - Before/after photos if relevant
   - Image captions

7. **Technical Specifications** (if relevant)
   - Equipment used
   - Materials used
   - Quality certifications applied
   - Standards compliance

8. **Key Metrics**
   - Budget (optional, if shareable)
   - Timeline/Duration
   - Team size
   - Quality results
   - Customer rating/testimonial

9. **Related Projects**
   - 3-4 similar projects
   - Brief description and link

10. **Project Inquiry**
    - CTA to inquire about similar services
    - Quick contact form

## Blog Structure

### Blog Hub Page (/blog)

**Content:**
- Blog introduction
- Featured/pinned post (latest or most popular)
- List of all blog posts (10 per page)
- Per post: title, excerpt, date, author, thumbnail image
- Pagination
- Category filter/sidebar
- Search functionality
- Subscribe to blog link

### Individual Blog Post (/blog/[slug])

**Blog Post Structure:**

1. **Article Header**
   - Title (H1)
   - Author name
   - Publish date
   - Read time estimate
   - Category tag
   - Featured image

2. **Article Content**
   - Introduction/hook
   - Well-structured body with H2/H3 subheadings
   - Bullet points, lists, emphasis as appropriate
   - Internal links to related content
   - Code blocks if technical (with syntax highlighting)
   - Images with captions
   - Blockquotes for emphasis

3. **Article Metadata**
   - Word count
   - Category
   - Tags
   - Author bio (50-100 words)
   - Author photo

4. **Call-to-Action**
   - Related service link
   - Related project link
   - Contact/inquiry link

5. **Related Articles**
   - 3-5 related blog posts
   - Brief description and link

6. **Comments/Discussion** (optional)
   - Comment section (moderated)
   - Social sharing buttons

### Blog Content Strategy

**Content Categories:**
- Industry trends and insights
- Company news and updates
- How-to and educational content
- Case studies and project highlights
- Behind-the-scenes team stories
- Technology and innovation
- Customer success stories

**Publishing Frequency**: 2 posts per month minimum

**Content Length**: 1000-2500 words per post

## Contact Page

### Contact Page Structure (/contact)

1. **Page Header**
   - Headline ("Get in Touch" / "Contact Us")
   - Brief description of next steps

2. **Contact Form**
   - Name field (required)
   - Email field (required)
   - Phone field (recommended)
   - Company field (recommended)
   - Service interest dropdown (required)
   - Project description / Message (required, 50+ characters)
   - File upload for attachments (optional)
   - Recaptcha validation
   - Submit button
   - Confirmation message

3. **Contact Information**
   - Office address(es)
   - Phone number(s)
   - Email address
   - Business hours
   - Map with location

4. **Response Commitment**
   - Clear statement: "We respond within 24 business hours"
   - Alternative contact methods if urgent

5. **Additional Sections**
   - FAQ (common contact questions)
   - Link to service pages
   - Link to project portfolio
   - Social media links

6. **Success Page**
   - Confirmation message after form submission
   - Expected response timeline
   - Link back to website
   - Email confirmation sent

### Contact Form Integration
- Integration with email service
- Form data logging for follow-up
- Automatic email confirmation to submitter
- Team notification when inquiry received
- CRM integration (if applicable)

## SEO Requirements

### Technical SEO

**On-Page Requirements:**
- [ ] Unique H1 per page (brand name excluded)
- [ ] Strategic keyword placement in titles, H1, first 100 words
- [ ] Meta descriptions (120-160 characters) for all pages
- [ ] Keyword-optimized URLs (lowercase, hyphens, descriptive)
- [ ] Internal linking strategy (3-5 links per page minimum)
- [ ] Mobile-responsive design (responsive CSS, mobile viewport)
- [ ] Page load speed < 3 seconds (Core Web Vitals)
- [ ] Structured data (Schema.org markup) for organization, services, projects
- [ ] XML sitemap (auto-generated, updated regularly)
- [ ] robots.txt configured correctly
- [ ] Canonical tags for duplicate content prevention

**Performance Requirements:**
- [ ] Lighthouse score ≥ 90 (Performance)
- [ ] Lighthouse score ≥ 90 (SEO)
- [ ] Largest Contentful Paint (LCP) < 2.5 seconds
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] First Input Delay (FID) < 100ms
- [ ] Image optimization (WebP, lazy loading)
- [ ] CSS/JS minification and code splitting

**Content SEO:**
- [ ] Service pages target specific keywords (50-100 high-intent keywords)
- [ ] Blog content targets informational keywords
- [ ] Project pages target long-tail keywords
- [ ] Keyword density 1-2% for main keywords
- [ ] Natural keyword placement in body text

### Off-Page SEO

- [ ] Backlink strategy from industry directories
- [ ] Local SEO optimization (Google My Business, maps)
- [ ] Social media presence and sharing
- [ ] Press releases and news coverage
- [ ] Industry partnerships and citations

### Local SEO
- [ ] Google My Business profile optimized
- [ ] Local citations in Vietnamese business directories
- [ ] Location pages if multiple offices
- [ ] Local keywords in content (city names, regions)
- [ ] Local structured data (LocalBusiness schema)

### SEO Goals (12-Month)
- [ ] 50+ target keywords ranking on first page
- [ ] 10+ keywords in top 3 positions
- [ ] 500+ monthly organic sessions
- [ ] 10%+ conversion rate from organic traffic
- [ ] Domain authority 60+

## Accessibility Requirements

### WCAG 2.1 AA Compliance

**Visual Accessibility:**
- [ ] Color contrast ratio ≥ 4.5:1 for normal text
- [ ] Color contrast ratio ≥ 3:1 for large text
- [ ] No color used as only way to convey information
- [ ] Font size ≥ 12px minimum
- [ ] Line height ≥ 1.5
- [ ] Letter spacing ≥ 0.12em for justified text

**Keyboard Navigation:**
- [ ] All interactive elements accessible via keyboard (Tab key)
- [ ] Focus visible indicator on all interactive elements
- [ ] Logical tab order (left-to-right, top-to-bottom)
- [ ] No keyboard traps
- [ ] Skip-to-main-content link on all pages

**Screen Reader Compatibility:**
- [ ] Semantic HTML (proper heading hierarchy, landmarks)
- [ ] Alt text for all images (descriptive, not "image of...")
- [ ] Form labels associated with inputs (label + for/id)
- [ ] ARIA labels for icon-only buttons
- [ ] Proper list markup (ul, ol, li)
- [ ] Table headers properly marked (th, scope attribute)
- [ ] Language attribute on html element
- [ ] Language changes marked with lang attribute

**Responsive & Mobile:**
- [ ] Touch targets ≥ 48x48 pixels
- [ ] Readable without horizontal scrolling at 200% zoom
- [ ] Responsive text sizing (no fixed pixel sizes)
- [ ] Zoom functionality not disabled (viewport-fit permitted)

**Navigation & Structure:**
- [ ] Consistent navigation structure across pages
- [ ] Breadcrumb navigation for complex pages
- [ ] Clear page purpose/title in H1
- [ ] Descriptive link text (not "click here")
- [ ] Page structure with landmarks (header, nav, main, footer)

**Forms:**
- [ ] Error messages clear and actionable
- [ ] Required fields clearly marked
- [ ] Input validation feedback provided
- [ ] Success messages clear
- [ ] Form instructions visible before required fields

**Media:**
- [ ] Video captions for all videos
- [ ] Audio transcripts for all audio content
- [ ] Pause/stop controls for auto-playing media
- [ ] No flashing content (> 3 flashes per second)

## Responsive Requirements

### Breakpoints

- **Mobile**: 320px - 479px (phones, small devices)
- **Tablet**: 480px - 1023px (tablets, large phones)
- **Desktop**: 1024px+ (large screens, desktops)
- **Large Desktop**: 1440px+ (ultra-wide displays)

### Mobile Design Principles

- [ ] Single-column layout for content
- [ ] Touch-friendly button sizes (≥ 48px)
- [ ] Readable typography without zooming
- [ ] No horizontal scrolling
- [ ] Mobile-optimized navigation (hamburger menu)
- [ ] Efficient use of viewport

### Tablet Design

- [ ] 2-column layouts where appropriate
- [ ] Optimized touch targets
- [ ] Efficient whitespace usage
- [ ] Readable text sizes

### Desktop Design

- [ ] Multi-column layouts
- [ ] Full-width features leveraged
- [ ] Hover states on interactive elements
- [ ] Optimized typography line lengths

### Responsive Features

**Navigation:**
- [ ] Mobile: Hamburger menu (collapsible)
- [ ] Tablet: Simplified horizontal nav or hybrid
- [ ] Desktop: Full horizontal navigation bar

**Images:**
- [ ] Responsive image sizes (srcset, sizes)
- [ ] Different images for mobile vs desktop (art direction)
- [ ] WebP format with fallback
- [ ] Lazy loading for below-fold images

**Content:**
- [ ] Stacked sections on mobile
- [ ] Side-by-side on desktop
- [ ] Flexible grid layouts
- [ ] Readable line lengths (50-75 characters)

**Forms:**
- [ ] Single column on mobile
- [ ] Multiple columns on desktop
- [ ] Large touch targets on mobile
- [ ] Full-width inputs on mobile

## Performance Requirements

### Load Time Goals

- [ ] First Contentful Paint (FCP): < 1.8 seconds
- [ ] Largest Contentful Paint (LCP): < 2.5 seconds
- [ ] Time to Interactive (TTI): < 3.8 seconds
- [ ] Cumulative Layout Shift (CLS): < 0.1
- [ ] First Input Delay (FID): < 100ms

### File Size Budgets

- [ ] HTML: < 50 KB
- [ ] CSS: < 100 KB (after gzip)
- [ ] JavaScript: < 200 KB (after gzip, total)
- [ ] Images: < 50 KB average per image
- [ ] Total page weight: < 2 MB (full page including images)

### Optimization Techniques

- [ ] Image optimization (compression, WebP, responsive sizes)
- [ ] CSS/JS minification and tree-shaking
- [ ] Code splitting (lazy load routes)
- [ ] Critical CSS inlining
- [ ] Font optimization (WOFF2, system fonts as fallback)
- [ ] Caching strategy (browser caching, service workers)
- [ ] CDN for static assets
- [ ] Compression (gzip/brotli)
- [ ] Preload/prefetch for key resources

### Lighthouse Targets

- [ ] Performance Score: ≥ 90
- [ ] Accessibility Score: ≥ 90
- [ ] Best Practices Score: ≥ 90
- [ ] SEO Score: ≥ 90

## Acceptance Criteria

### Website Launch Criteria (MVP)

**Functionality:**
- [ ] All pages load without errors
- [ ] All forms submit successfully
- [ ] Contact form sends emails to team
- [ ] All internal links work
- [ ] No broken images
- [ ] Mobile navigation works smoothly
- [ ] Search functionality works (if implemented)

**Performance:**
- [ ] Lighthouse Performance score ≥ 85
- [ ] Page load time < 3 seconds on 4G
- [ ] Core Web Vitals pass (green status)
- [ ] No JavaScript errors in console

**Content:**
- [ ] All services documented
- [ ] At least 10 projects in portfolio
- [ ] At least 5 blog posts published
- [ ] All images have alt text
- [ ] All copy reviewed and approved

**Design:**
- [ ] Mobile responsive (works on iPhone, Android, tablet, desktop)
- [ ] Consistent branding (colors, fonts, logo)
- [ ] Professional appearance
- [ ] Consistent spacing and alignment
- [ ] Proper color contrast

**SEO:**
- [ ] Meta titles and descriptions on all pages
- [ ] XML sitemap generated
- [ ] robots.txt configured
- [ ] Google Analytics installed and tracking
- [ ] Google My Business claimed and optimized
- [ ] Schema markup implemented (Organization, Service, Project)

**Accessibility:**
- [ ] WCAG 2.1 AA compliance checked
- [ ] Keyboard navigation functional
- [ ] Screen reader tested with NVDA/JAWS
- [ ] Color contrast verified
- [ ] Form labels associated with inputs

**Security:**
- [ ] SSL/HTTPS enabled
- [ ] Contact form has CSRF protection
- [ ] No sensitive data in source
- [ ] Security headers configured

**Monitoring:**
- [ ] Google Analytics set up
- [ ] Form submissions tracked
- [ ] Page conversion goals defined
- [ ] Error monitoring configured
- [ ] Performance monitoring configured

### Post-Launch Criteria (Ongoing)

**Analytics (30 days):**
- [ ] Establish baseline traffic (organic, direct, referral)
- [ ] Identify top landing pages
- [ ] Track inquiry conversion rate
- [ ] Monitor page performance metrics

**SEO (90 days):**
- [ ] Target keywords ranking improving
- [ ] Organic traffic increasing
- [ ] Backlink profile growing
- [ ] Local search visibility improving

**Content (ongoing):**
- [ ] Blog posts published 2x per month
- [ ] Portfolio updated with new projects
- [ ] Testimonials/case studies added
- [ ] Content freshness maintained

**Quality (ongoing):**
- [ ] Bug reports addressed within 48 hours
- [ ] Performance maintained (Lighthouse ≥ 85)
- [ ] No broken links or images
- [ ] Security updated/patched
- [ ] Mobile responsiveness tested on new devices

**Business (ongoing):**
- [ ] Inquiries captured and tracked
- [ ] Lead response time ≤ 24 hours
- [ ] Customer feedback collected
- [ ] ROI measured against goals
- [ ] Conversion rate optimized
