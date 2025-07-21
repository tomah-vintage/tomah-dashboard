# SvelteKit Project Development Instructions

## Project Overview
- **Framework**: SvelteKit
- **Language**: TypeScript/JavaScript
- **Styling**: design_guideline.md
- **Authentication**: no decided 
- **UI Components**: Skeleton UI

## Development Standards

### Code Style & Structure
- Use TypeScript for all new files
- Follow SvelteKit file-based routing conventions
- Use `+page.svelte` for pages and `+layout.svelte` for layouts
- Place reusable components in `src/lib/components/`
- Use `src/lib/utils/` for utility functions
- Store types in `src/lib/types/`
- Use kebab-case for file names and component names

### Component Guidelines
- Create functional, accessible components
- Use proper TypeScript interfaces for props
- Include JSDoc comments for complex components
- Use Svelte stores for state management when needed
- Implement proper error boundaries

### API & Data Handling
- Use `+page.server.ts` for server-side data loading
- Implement proper form actions in `+page.server.ts`
- Use `$lib/server/` for server-only code
- Implement proper error handling and validation
- Use environment variables for sensitive data

### Styling Conventions
- [If using Tailwind]: Use utility classes, create custom components for repeated patterns
- [If using CSS]: Use CSS custom properties, follow BEM methodology
- Ensure responsive design (mobile-first approach)
- Maintain consistent spacing and typography
- Use semantic HTML elements

## File Structure Requirements

```
src/
├── app.html
├── app.css
├── routes/
│   ├── +layout.svelte
│   ├── +layout.server.ts
│   ├── +page.svelte
│   ├── +page.server.ts
│   └── [feature]/
│       ├── +page.svelte
│       └── +page.server.ts
├── lib/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   └── [feature]/    # Feature-specific components
│   ├── stores/           # Svelte stores
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript types
│   └── server/           # Server-only code
└── static/               # Static assets
```

## Specific Instructions

### When Creating New Pages:
1. Create the route folder structure
2. Implement `+page.svelte` with proper TypeScript
3. Add `+page.server.ts` if server-side data is needed
4. Include proper SEO meta tags
5. Ensure responsive design
6. Add loading states and error handling

### When Creating Components:
1. Use TypeScript interfaces for props
2. Include proper accessibility attributes
3. Add JSDoc comments
4. Implement proper event handling
5. Use Svelte's reactive statements when needed
6. Consider slot usage for flexibility

### When Working with Forms:
1. Use SvelteKit's form actions
2. Implement proper validation (client and server)
3. Add loading states and error messages
4. Use progressive enhancement
5. Include CSRF protection if needed

### When Handling Data:
1. Use proper loading functions
2. Implement caching strategies
3. Handle errors gracefully
4. Use TypeScript for type safety
5. Consider offline functionality

## Environment Variables
```
# Required environment variables
AUTH_SECRET=
PUBLIC_SITE_URL=
# Add your specific variables here
```

## Performance Considerations
- Implement proper code splitting
- Use lazy loading for images and components
- Optimize bundle size
- Implement proper caching strategies
- Consider preloading for critical routes

## Security Guidelines
- Validate all user inputs
- Use proper authentication checks
- Implement CSRF protection
- Sanitize data before database operations
- Use environment variables for secrets
- Implement rate limiting where appropriate

## Common Tasks

### Adding a New Feature:
1. Create route structure in `src/routes/[feature]/`
2. Build necessary components in `src/lib/components/[feature]/`
3. Add types in `src/lib/types/[feature].ts`
4. Implement API endpoints if needed
5. Add proper error handling and validation
7. Update documentation

### API Integration:
1. Create typed API functions in `src/lib/utils/api.ts`
2. Implement proper error handling
3. Add loading states
4. Use proper HTTP methods
5. Handle authentication tokens

## Code Quality Checklist
- [ ] TypeScript types are properly defined
- [ ] Components are accessible (ARIA labels, keyboard navigation)
- [ ] Error handling is implemented
- [ ] Loading states are present
- [ ] Responsive design is working
- [ ] Code is properly commented
- [ ] Security best practices are followed

## Debugging Instructions
- Use browser dev tools for client-side issues
- Check server logs for SSR problems
- Use SvelteKit's built-in debugging tools
- Implement proper logging for production
- Use proper error boundaries

## Additional Notes
- Always consider accessibility in component design
- Use semantic HTML elements
- Implement proper SEO practices
- Consider internationalization if needed
- Keep dependencies up to date
- Follow SvelteKit's best practices and conventions

---

**Important**: When implementing features, always prioritize user experience, accessibility, and performance. Write clean, maintainable code that follows these guidelines consistently.**b**