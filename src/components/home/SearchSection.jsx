import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import TVShowsTab from '../search/TVShowsTab'
import MoviesTab from '../search/MoviesTab'

/**
 * Search section component
 * Contains the search functionality with tabs
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onShowClick - Callback when show is clicked
 * @param {Function} props.onMovieClick - Callback when movie is clicked
 */
const SearchSection = ({ onShowClick, onMovieClick }) => {
  return (
    <Box mb={{ base: 8, md: 12 }}>
      <Heading
        size={{ base: 'lg', md: 'xl' }}
        color="white"
        fontWeight="bold"
        mb={{ base: 4, md: 6 }}
        fontSize={{ base: '24px', md: '32px' }}
      >
        Search
      </Heading>
      
      <Tabs variant="netflix" colorScheme="netflix">
        <TabList mb={{ base: 4, md: 8 }} borderBottom="none">
          <Tab
            fontSize={{ base: '16px', md: '20px' }}
            px={{ base: 4, md: 6 }}
            py={{ base: 3, md: 4 }}
          >
            TV Shows
          </Tab>
          <Tab
            fontSize={{ base: '16px', md: '20px' }}
            px={{ base: 4, md: 6 }}
            py={{ base: 3, md: 4 }}
          >
            Movies
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <TVShowsTab onShowClick={onShowClick} />
          </TabPanel>

          <TabPanel px={0}>
            <MoviesTab onMovieClick={onMovieClick} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default SearchSection

