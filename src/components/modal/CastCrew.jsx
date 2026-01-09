import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Avatar,
  SimpleGrid,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getImageUrl } from '../../services/tmdbApi'
import { COLORS } from '../../utils/constants'

const TEXT_COLOR = COLORS.TEXT_PRIMARY

// Important crew roles to display
const IMPORTANT_CREW_ROLES = [
  'Director',
  'Producer',
  'Executive Producer',
  'Screenplay',
  'Writer',
  'Story',
  'Cinematography',
  'Director of Photography',
  'Editor',
  'Music',
  'Original Music Composer',
  'Composer',
]

/**
 * Cast and Crew component
 * Displays all actors and organized crew members
 * 
 * @param {Object} props - Component props
 * @param {Array} props.cast - Array of cast members
 * @param {Array} props.crew - Array of crew members
 * @param {boolean} props.loading - Loading state
 */
const CastCrew = ({ cast = [], crew = [], loading = false }) => {
  const { t } = useTranslation()
  const [showAllCast, setShowAllCast] = useState(false)

  // Organize crew by role
  const crewByRole = crew.reduce((acc, person) => {
    const role = person.job || person.department
    if (!acc[role]) {
      acc[role] = []
    }
    acc[role].push(person)
    return acc
  }, {})

  // Get important crew roles
  const importantCrew = IMPORTANT_CREW_ROLES.filter((role) => crewByRole[role]?.length > 0)
  
  // Get other crew roles (not in important list)
  const otherCrewRoles = Object.keys(crewByRole).filter(
    (role) => !IMPORTANT_CREW_ROLES.includes(role) && crewByRole[role]?.length > 0
  )

  if (loading) {
    return (
      <Box>
        <Text color={TEXT_COLOR} fontSize={{ base: 'sm', md: 'md' }}>
          {t('modal.loadingCastCrew')}
        </Text>
      </Box>
    )
  }

  if (cast.length === 0 && crew.length === 0) {
    return null
  }

  // Display cast members
  const displayedCast = showAllCast ? cast : cast.slice(0, 12)

  return (
    <VStack align="stretch" spacing={{ base: 4, md: 6 }}>
      {/* Cast Section */}
      {cast.length > 0 && (
        <Box>
          <Heading
            size={{ base: 'sm', md: 'md' }}
            color={TEXT_COLOR}
            fontWeight="600"
            mb={{ base: 3, md: 4 }}
            fontSize={{ base: '16px', md: '20px' }}
          >
            {t('modal.cast')} ({cast.length})
          </Heading>
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
            spacing={{ base: 3, md: 4 }}
          >
            {displayedCast.map((actor) => (
              <HStack
                key={actor.id}
                spacing={3}
                bg="rgba(255, 255, 255, 0.05)"
                p={3}
                borderRadius="md"
                _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                transition="all 0.2s"
              >
                <Avatar
                  size={{ base: 'sm', md: 'md' }}
                  src={actor.profile_path ? getImageUrl(actor.profile_path) : undefined}
                  name={actor.name}
                  bg="rgba(255, 255, 255, 0.1)"
                />
                <VStack align="flex-start" spacing={0} flex={1} minW={0}>
                  <Text
                    color={TEXT_COLOR}
                    fontWeight="600"
                    fontSize={{ base: 'xs', md: 'sm' }}
                    noOfLines={1}
                  >
                    {actor.name}
                  </Text>
                  <Text
                    color="rgba(255, 255, 255, 0.6)"
                    fontSize={{ base: 'xs', md: 'xs' }}
                    noOfLines={1}
                  >
                    {actor.character || actor.roles?.[0]?.character || 'Actor'}
                  </Text>
                </VStack>
              </HStack>
            ))}
          </SimpleGrid>
          {cast.length > 12 && (
            <Button
              mt={4}
              variant="ghost"
              colorScheme="netflix"
              size="sm"
              onClick={() => setShowAllCast(!showAllCast)}
              w="100%"
            >
              {showAllCast ? t('modal.showLess') : `${t('modal.showAll')} ${t('modal.cast')} (${cast.length})`}
            </Button>
          )}
        </Box>
      )}

      {/* Crew Section */}
      {crew.length > 0 && (
        <Box>
          <Heading
            size={{ base: 'sm', md: 'md' }}
            color={TEXT_COLOR}
            fontWeight="600"
            mb={{ base: 3, md: 4 }}
            fontSize={{ base: '16px', md: '20px' }}
          >
            {t('modal.crew')}
          </Heading>
          <Accordion allowToggle defaultIndex={[0]} reduceMotion>
            {/* Important Crew Roles */}
            {importantCrew.map((role) => {
              const roleMembers = crewByRole[role]

              return (
                <AccordionItem key={role} border="none" mb={2}>
                  <AccordionButton
                    bg="rgba(255, 255, 255, 0.05)"
                    borderRadius="md"
                    _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                    px={4}
                    py={3}
                  >
                    <Box flex="1" textAlign="left">
                      <Text
                        color={TEXT_COLOR}
                        fontWeight="600"
                        fontSize={{ base: 'sm', md: 'md' }}
                        textTransform="capitalize"
                      >
                        {role} ({roleMembers.length})
                      </Text>
                    </Box>
                    <AccordionIcon color={TEXT_COLOR} />
                  </AccordionButton>
                  <AccordionPanel pb={4} pt={3} px={0}>
                    <SimpleGrid
                      columns={{ base: 1, sm: 2, md: 3 }}
                      spacing={{ base: 3, md: 4 }}
                    >
                      {roleMembers.map((person) => (
                        <HStack
                          key={`${person.id}-${person.job}`}
                          spacing={3}
                          bg="rgba(255, 255, 255, 0.03)"
                          p={3}
                          borderRadius="md"
                          _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }}
                          transition="all 0.2s"
                        >
                          <Avatar
                            size={{ base: 'sm', md: 'md' }}
                            src={person.profile_path ? getImageUrl(person.profile_path) : undefined}
                            name={person.name}
                            bg="rgba(255, 255, 255, 0.1)"
                          />
                          <VStack align="flex-start" spacing={0} flex={1} minW={0}>
                            <Text
                              color={TEXT_COLOR}
                              fontWeight="600"
                              fontSize={{ base: 'xs', md: 'sm' }}
                              noOfLines={1}
                            >
                              {person.name}
                            </Text>
                            {person.department && person.department !== role && (
                              <Text
                                color="rgba(255, 255, 255, 0.5)"
                                fontSize={{ base: '2xs', md: 'xs' }}
                                noOfLines={1}
                              >
                                {person.department}
                              </Text>
                            )}
                          </VStack>
                        </HStack>
                      ))}
                    </SimpleGrid>
                  </AccordionPanel>
                </AccordionItem>
              )
            })}

            {/* Other Crew Roles */}
            {otherCrewRoles.length > 0 && (
              <AccordionItem border="none" mb={2}>
                <AccordionButton
                  bg="rgba(255, 255, 255, 0.05)"
                  borderRadius="md"
                  _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                  px={4}
                  py={3}
                >
                  <Box flex="1" textAlign="left">
                    <Text
                      color={TEXT_COLOR}
                      fontWeight="600"
                      fontSize={{ base: 'sm', md: 'md' }}
                    >
                      {t('modal.otherCrew')} ({otherCrewRoles.reduce((sum, role) => sum + crewByRole[role].length, 0)})
                    </Text>
                  </Box>
                  <AccordionIcon color={TEXT_COLOR} />
                </AccordionButton>
                <AccordionPanel pb={4} pt={3} px={0}>
                  <Accordion allowToggle reduceMotion>
                    {otherCrewRoles.map((role) => {
                      const roleMembers = crewByRole[role]

                      return (
                        <AccordionItem key={role} border="none" mb={2}>
                          <AccordionButton
                            bg="rgba(255, 255, 255, 0.03)"
                            borderRadius="md"
                            _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }}
                            px={3}
                            py={2}
                          >
                            <Box flex="1" textAlign="left">
                              <Text
                                color="rgba(255, 255, 255, 0.8)"
                                fontWeight="600"
                                fontSize={{ base: 'xs', md: 'sm' }}
                                textTransform="capitalize"
                              >
                                {role} ({roleMembers.length})
                              </Text>
                            </Box>
                            <AccordionIcon color="rgba(255, 255, 255, 0.6)" />
                          </AccordionButton>
                          <AccordionPanel pb={3} pt={2} px={0}>
                            <SimpleGrid
                              columns={{ base: 1, sm: 2, md: 3 }}
                              spacing={{ base: 2, md: 3 }}
                            >
                              {roleMembers.map((person) => (
                                <HStack
                                  key={`${person.id}-${person.job}`}
                                  spacing={2}
                                  bg="rgba(255, 255, 255, 0.02)"
                                  p={2}
                                  borderRadius="md"
                                  _hover={{ bg: 'rgba(255, 255, 255, 0.05)' }}
                                  transition="all 0.2s"
                                >
                                  <Avatar
                                    size="sm"
                                    src={person.profile_path ? getImageUrl(person.profile_path) : undefined}
                                    name={person.name}
                                    bg="rgba(255, 255, 255, 0.1)"
                                  />
                                  <VStack align="flex-start" spacing={0} flex={1} minW={0}>
                                    <Text
                                      color={TEXT_COLOR}
                                      fontWeight="500"
                                      fontSize={{ base: '2xs', md: 'xs' }}
                                      noOfLines={1}
                                    >
                                      {person.name}
                                    </Text>
                                  </VStack>
                                </HStack>
                              ))}
                            </SimpleGrid>
                          </AccordionPanel>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                </AccordionPanel>
              </AccordionItem>
            )}
          </Accordion>
        </Box>
      )}
    </VStack>
  )
}

export default CastCrew
