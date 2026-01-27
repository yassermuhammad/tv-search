import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

/**
 * SEO Component for managing meta tags, Open Graph, Twitter Cards, and structured data
 * 
 * @param {Object} props - SEO configuration
 * @param {string} props.title - Page title (default: "WatchPedia - TV Shows & Movies Search")
 * @param {string} props.description - Meta description
 * @param {string} props.keywords - Meta keywords (comma-separated)
 * @param {string} props.image - Open Graph image URL
 * @param {string} props.type - Open Graph type (default: "website")
 * @param {string} props.url - Canonical URL
 * @param {Object} props.structuredData - JSON-LD structured data object
 * @param {boolean} props.noindex - Whether to prevent indexing (default: false)
 * @param {string} props.author - Author name
 */
const SEO = ({
  title = 'WatchPedia - TV Shows & Movies Search',
  description = 'Discover and search for your favorite TV shows and movies. Find trending content, popular titles, watch trailers, and manage your watchlist. Your ultimate guide to entertainment.',
  keywords = 'TV shows, movies, streaming, watchlist, entertainment, trending movies, popular TV shows, movie search, TV show search, watch trailers, movie database',
  image = '/tv-search/icon-512x512.png',
  type = 'website',
  url,
  structuredData,
  noindex = false,
  author = 'WatchPedia',
}) => {
  const location = useLocation()
  const baseUrl = 'https://yassermuhammad.github.io'
  const basePath = '/tv-search'
  const fullUrl = url || `${baseUrl}${basePath}${location.pathname}`
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${basePath}${image}`
  
  // Ensure title includes site name if not already present
  const fullTitle = title.includes('WatchPedia') ? title : `${title} | WatchPedia`
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="WatchPedia" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@watchpedia" />
      <meta name="twitter:creator" content="@watchpedia" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#E50914" />
      <meta name="msapplication-TileColor" content="#E50914" />
      <meta name="application-name" content="WatchPedia" />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <>
          {Array.isArray(structuredData) ? (
            structuredData.map((data, index) => (
              <script key={index} type="application/ld+json">
                {JSON.stringify(data)}
              </script>
            ))
          ) : (
            <script type="application/ld+json">
              {JSON.stringify(structuredData)}
            </script>
          )}
        </>
      )}
    </Helmet>
  )
}

export default SEO
