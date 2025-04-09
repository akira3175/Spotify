import { TooltipProps, Tooltip as TooltipAntd } from 'antd';

export const Tooltip = (props: TooltipProps) => {
  return <TooltipAntd placement='top' {...props}  arrow={false} />;
};

Tooltip.displayName = 'Tooltip';
