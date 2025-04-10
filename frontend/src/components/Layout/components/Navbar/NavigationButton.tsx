import type { FC } from 'react';
import { Tooltip } from '../../../Tooltip';
import classNames from 'classnames'; // Thêm thư viện classnames để quản lý class động

interface NavigationButtonProps {
  onClick: () => void;
  text: string;
  icon: React.ReactElement;
  backgroundNone?: boolean;
}

const NavigationButton: FC<NavigationButtonProps> = ({ onClick, text, icon, backgroundNone = false }) => {
  return (
    <Tooltip placement='bottom' title={text}>
      <button
        className={classNames('navigation-button', { 'no-background': backgroundNone })}
        onClick={onClick}
      >
        {icon}
      </button>
    </Tooltip>
  );
};

export default NavigationButton;