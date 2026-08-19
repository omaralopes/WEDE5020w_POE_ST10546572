# The Burger Bar website

HTML foundation for The Burger Bar, a Durban-based mobile halal smash-burger business.

## Pages


## Folders


The current submission is HTML-only. Menu prices and direct contact details still need confirmation by the business before publication.

# The Burger Bar Website

## Student Information

- **Student:** Omar
- **Student number:** ST10546572
- **Module:** Introduction to Web Development
- **Module code:** WEDE5020w

## Project Overview

The Burger Bar is a Durban-based mobile eatery specialising in American-inspired halal smash burgers. The business takes the grill to local trading spots, including 246 Currie Road in Morningside, and also caters for live-station events.

The website provides a central online home for the brand beyond Facebook. It introduces the organisation, presents the menu, highlights promotions, and gives customers a way to find the business and make contact. The website is aimed at local families, individuals, students, young adults, halaal diners, event hosts and smash-burger lovers in Durban and surrounding communities.

## Website Goals and Objectives

- Make the menu easy to view online.
- Improve the business's online visibility beyond Facebook.
- Promote specials and current trading updates.
- Make it easy for customers to find the Durban trading location.
- Support future online ordering and event enquiries.
- Build trust through the business story, halal identity and clear contact information.

## Key Features and Functionality

- Five linked HTML pages: Home, About Us, Menu, Promotions and Contact.
- Shared navigation menu on every page.
- Semantic HTML structure using headers, navigation, main content, sections, articles and footers.
- Menu categories for burgers, sides, sauces and drinks.
- Promotions and live-station event information.
- Contact form with name, email, subject and message fields.
- Business address and Google Maps link for 246 Currie Road, Morningside, Durban.
- Facebook link for current trading locations and announcements.
- Responsive viewport metadata ready for future CSS styling.
- Descriptive alternative text for images.

Online ordering, form processing, CSS styling and JavaScript interactivity are planned for later project parts.

## File and Folder Structure

```text
the-burger-bar/
├── index.html
├── about.html
├── menu.html
├── promotions.html
├── contact.html
├── css/
├── js/
└── images/
```

- `css/` is reserved for Part 2 styling.
- `js/` is reserved for Part 3 functionality.
- `images/` is reserved for locally stored, legally sourced images.

## Timeline and Milestones

| Week | Start date | Milestone | Phase | Key deliverables |
| --- | --- | --- | --- | --- |
| 1 | 20 July 2026 | Project initiation and research | Part 1 | Submit proposal, research the organisation and create the initial structure. |
| 2 | 27 July 2026 | Content planning and sitemap | Part 1 | Finalise sitemap, gather content, create wireframes and source legal assets. |
| 3 | 03 August 2026 | HTML foundation development | Part 1 | Create semantic HTML pages, navigation, content and images. |
| 4 | 10 August 2026 | HTML refinement and validation | Part 1 | Complete HTML, test links, validate structure and improve formatting. |
| 5 | 17 August 2026 | Final HTML testing and submission | Part 1 | Complete testing, update README and submit Part 1 by 21 August 2026. |
| 6-9 | 24 August-18 September 2026 | CSS foundation, layout and responsive design | Part 2 | Add styling, Grid/Flexbox layouts, responsive breakpoints and visual refinement. |
| 10-12 | 21 September-05 October 2026 | JavaScript, SEO and final testing | Part 3 | Add interactivity, form functionality, SEO improvements and final testing. |

## Part 1 Details

Part 1 establishes the HTML foundation for the website. It includes:

- Research-based content about The Burger Bar.
- A five-page website based on the approved sitemap.
- Semantic HTML5 structure on every page.
- Working internal navigation links across all pages.
- Menu, promotions, business information and contact content.
- Accessible labels for form fields and alternative text for images.
- HTML comments explaining the main code sections.
- A README documenting the project and its current stage.

Part 2 will add CSS styling, the colour palette, typography, layouts and responsive design. Part 3 will add JavaScript interactivity, form processing, SEO improvements and advanced features.

## Sitemap

```text
Home (index.html)
├── About Us (about.html)
├── Menu (menu.html)
│   ├── Burgers section
│   ├── Sides and sauces section
│   └── Drinks section
├── Promotions (promotions.html)
└── Contact (contact.html)
	├── Business address
	├── Google Maps link
	├── Contact form
	└── Event booking information
```

## Navigation and Testing

The navigation uses relative HTML links and appears consistently on every page. The `aria-current` attribute identifies the page currently being viewed.

Completed checks:

- Confirmed all five HTML pages contain `header`, `nav`, `main` and `footer` elements.
- Confirmed internal navigation targets exist.
- Confirmed obsolete `products.html` and `enquiry.html` references are absent.
- Confirmed the HTML files are consistently indented and `git diff --check` reports no whitespace errors.
- Confirmed the HTML-only pages can be opened as static files without a build step.

Before final publication, the pages should also be opened and checked in current versions of Safari, Chrome and Firefox at desktop and mobile viewport sizes. Form submission and remote image availability should be checked once the final backend and local image assets are selected.

## GitHub Repository

The project is prepared for a private GitHub repository. The lecturer's repository link or access instructions are still required before the remote can be connected. Commits should use descriptive messages, for example:

```text
Create Part 1 semantic HTML pages
Add researched Burger Bar content
Update README and validate navigation
```

## Changelog

### 19 August 2026

- Created the initial five-page HTML website.
- Added shared navigation and footer structures.
- Added researched content for the organisation, menu, promotions and contact page.
- Added HTML comments explaining the main page sections.
- Added the Part 1 README documentation.
- Validated internal links, semantic landmarks and whitespace.

## References

- The Burger Bar, 2026. Facebook page. Available at: https://www.facebook.com/theburgerbardbn (Accessed 20 July 2026).
- Afrihost, 2026. Domains. Available at: https://www.afrihost.com/domains (Accessed 20 July 2026).
- ColorHunt, n.d. Colour palettes for designers and artists. Available at: https://colorhunt.co (Accessed 20 July 2026).
- Google Fonts, n.d. Free fonts library. Available at: https://fonts.google.com (Accessed 20 July 2026).
- Magnific, n.d. Images. Available at: https://www.magnific.com (Accessed 20 July 2026).
