import { Link, Text } from 'theme-ui'
import Page from 'popup/components/Page'
import InfoItem from './InfoItem'

interface SettingsPageProps {
  tab: string
}

const SettingsPage = ({ tab }: SettingsPageProps) => {
  return (
    <Page isCurrentTab={tab === 'settings'} title={'Info'}>
      <InfoItem title={'Hide Debugging Notification Bar'}>
        While spoofing data a notification bar becomes visible. Hiding the bar
        can be done by using the{' '}
        <Text sx={{ fontStyle: 'italic', mr: '2px' }}>
          --silent-debugger-extension-api
        </Text>{' '}
        flag.{' '}
        <Link
          variant="hover"
          href={`https://www.chromium.org/developers/how-tos/run-chromium-with-flags`}
          target="_blank"
        >
          Instructions on how to run chrome with flags
        </Link>
        .
      </InfoItem>
    </Page>
  )
}

export default SettingsPage
