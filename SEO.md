# SEO Implementation Guide

## Overview

WatchPedia has been optimized for search engines with comprehensive SEO implementation including meta tags, structured data, sitemap, and robots.txt.

## Features Implemented

### 1. **Meta Tags**
- **Title Tags**: Dynamic, descriptive titles for each page
- **Meta Descriptions**: Compelling descriptions optimized for search results
- **Keywords**: Relevant keywords for each page
- **Canonical URLs**: Prevents duplicate content issues
- **Open Graph Tags**: Optimized for Facebook and social media sharing
- **Twitter Cards**: Enhanced Twitter sharing with large image cards

### 2. **Structured Data (JSON-LD)**
- **Website Schema**: Search functionality and organization info
- **Movie Schema**: Rich snippets for movie pages
- **TV Series Schema**: Rich snippets for TV show pages
- **Person Schema**: Actor/director information
- **Breadcrumb Schema**: Navigation structure
- **CollectionPage Schema**: For listing pages (trending, popular)

### 3. **Sitemap**
- Located at: `/tv-search/sitemap.xml`
- Includes all main pages with priority and change frequency
- Updated automatically with deployment

### 4. **Robots.txt**
- Located at: `/tv-search/robots.txt`
- Allows all search engines to crawl the site
- Points to sitemap location
- Excludes watchlist (private user data)

### 5. **Page-Specific SEO**

#### Home Page
- Title: "WatchPedia - Discover Trending Movies & TV Shows"
- Focus: Trending and popular content discovery
- Structured Data: Website schema with search action

#### Search Page
- Title: "Search Movies & TV Shows"
- Focus: Search functionality
- Keywords: movie search, TV show search

#### Trending/Popular Pages
- Dynamic titles based on content type
- CollectionPage structured data
- Includes item lists for rich snippets

#### Person Pages
- Dynamic titles with person name
- Person schema with filmography
- Breadcrumb navigation

#### Share Pages
- Dynamic titles with movie/show name
- Movie/TV Series schema
- Optimized for social sharing

## Installation

The SEO implementation uses `react-helmet-async`. Install it if not already installed:

```bash
yarn add react-helmet-async
# or
npm install react-helmet-async
```

## Files Structure

```
src/
├── components/
│   └── seo/
│       └── SEO.jsx          # Main SEO component
├── utils/
│   └── seoHelpers.js         # Structured data generators
├── pages/
│   ├── Home.jsx              # With SEO
│   ├── Search.jsx            # With SEO
│   ├── Watchlist.jsx         # With SEO (noindex)
│   ├── TrendingMovies.jsx    # With SEO
│   ├── TrendingTVShows.jsx   # With SEO
│   ├── PopularMovies.jsx     # With SEO
│   ├── PopularTVShows.jsx    # With SEO
│   ├── Person.jsx            # With SEO
│   ├── Share.jsx             # With SEO
│   ├── SimilarMovies.jsx     # With SEO
│   └── SimilarTVShows.jsx    # With SEO
public/
├── robots.txt                # Search engine directives
└── sitemap.xml               # Site structure
index.html                    # Base meta tags
```

## Best Practices

### 1. **Title Tags**
- Keep under 60 characters
- Include brand name (WatchPedia)
- Be descriptive and keyword-rich
- Unique for each page

### 2. **Meta Descriptions**
- Keep under 160 characters
- Include primary keywords naturally
- Compelling call-to-action
- Unique for each page

### 3. **Structured Data**
- Always validate with [Google Rich Results Test](https://search.google.com/test/rich-results)
- Keep data accurate and up-to-date
- Use appropriate schema types

### 4. **Images**
- Use high-quality images (1200x630 for OG images)
- Optimize file sizes
- Include alt text (handled by components)

### 5. **URLs**
- Use descriptive, keyword-rich URLs
- Keep URLs short and readable
- Use canonical URLs to prevent duplicates

## Testing SEO

### Tools to Use:
1. **Google Search Console**: Monitor search performance
2. **Google Rich Results Test**: Validate structured data
3. **Facebook Sharing Debugger**: Test Open Graph tags
4. **Twitter Card Validator**: Test Twitter cards
5. **PageSpeed Insights**: Check performance (affects SEO)

### Validation Checklist:
- [ ] All pages have unique titles
- [ ] All pages have meta descriptions
- [ ] Structured data validates without errors
- [ ] Sitemap is accessible and valid
- [ ] Robots.txt is accessible
- [ ] Open Graph tags work on Facebook
- [ ] Twitter cards work on Twitter
- [ ] Canonical URLs are correct
- [ ] No duplicate content issues

## Performance Impact

SEO implementation is lightweight:
- React Helmet Async: ~5KB gzipped
- Structured data: Minimal overhead (JSON strings)
- Meta tags: No performance impact

## Future Enhancements

1. **Dynamic Sitemap Generation**: Generate sitemap dynamically with all movies/shows
2. **Image Optimization**: Implement WebP format with fallbacks
3. **AMP Pages**: Create AMP versions for faster mobile loading
4. **International SEO**: Add hreflang tags for multi-language support
5. **Video Schema**: Add video structured data for trailers
6. **Review Schema**: Add aggregate ratings schema

## Monitoring

Monitor SEO performance:
1. Set up Google Search Console
2. Track keyword rankings
3. Monitor click-through rates
4. Check for crawl errors
5. Review structured data errors

## Resources

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
