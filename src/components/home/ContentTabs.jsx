import { useState } from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import TrendingMoviesTab from './TrendingMoviesTab'
import TrendingTVShowsTab from './TrendingTVShowsTab'
import PopularMoviesTab from './PopularMoviesTab'
import PopularTVShowsTab from './PopularTVShowsTab'

/**
 * Content tabs component
 * Provides tabbed interface for browsing trending and popular content
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onMovieClick - Callback when movie is clicked
 * @param {Function} props.onShowClick - Callback when show is clicked
 */
const ContentTabs = ({ onMovieClick, onShowClick }) => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <Tabs
      index={activeTab}
      onChange={setActiveTab}
      variant="netflix"
      colorScheme="netflix"
    >
      <TabList
        mb={{ base: 4, md: 8 }}
        borderBottom="none"
        overflowX="auto"
        overflowY="hidden"
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <Tab
          fontSize={{ base: '14px', sm: '16px', md: '18px' }}
          px={{ base: 3, sm: 4, md: 6 }}
          py={{ base: 3, md: 4 }}
          whiteSpace="nowrap"
          flexShrink={0}
        >
          Trending Movies
        </Tab>
        <Tab
          fontSize={{ base: '14px', sm: '16px', md: '18px' }}
          px={{ base: 3, sm: 4, md: 6 }}
          py={{ base: 3, md: 4 }}
          whiteSpace="nowrap"
          flexShrink={0}
        >
          Trending TV Shows
        </Tab>
        <Tab
          fontSize={{ base: '14px', sm: '16px', md: '18px' }}
          px={{ base: 3, sm: 4, md: 6 }}
          py={{ base: 3, md: 4 }}
          whiteSpace="nowrap"
          flexShrink={0}
        >
          Popular Movies
        </Tab>
        <Tab
          fontSize={{ base: '14px', sm: '16px', md: '18px' }}
          px={{ base: 3, sm: 4, md: 6 }}
          py={{ base: 3, md: 4 }}
          whiteSpace="nowrap"
          flexShrink={0}
        >
          Popular TV Shows
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel px={0}>
          <TrendingMoviesTab onMovieClick={onMovieClick} />
        </TabPanel>

        <TabPanel px={0}>
          <TrendingTVShowsTab onShowClick={onShowClick} />
        </TabPanel>

        <TabPanel px={0}>
          <PopularMoviesTab onMovieClick={onMovieClick} />
        </TabPanel>

        <TabPanel px={0}>
          <PopularTVShowsTab onShowClick={onShowClick} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default ContentTabs

