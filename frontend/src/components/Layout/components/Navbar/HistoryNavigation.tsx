import { Space } from 'antd';
import NavigationButton from './NavigationButton';
import ForwardBackwardsButton from './ForwardBackwardsButton';
import { FaSpotify } from 'react-icons/fa6';

// Utils
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { memo, useMemo } from 'react';
import { ActiveHomeIcon, HomeIcon } from '../../../Icons';

const HistoryNavigation = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(['navbar']);


  return (
    <Space size={10} align='center'>
      <NavigationButton
        text={t('Home')}
        icon={<FaSpotify size={25} fill='white' />}   
        onClick={() => navigate('/')}
        backgroundNone ={ true }
      />

      <div className='flex flex-row items-center gap-2 h-full'>
        <ForwardBackwardsButton flip />
        <ForwardBackwardsButton flip={false} />
      </div>
    </Space>
  );
});

export default HistoryNavigation;
