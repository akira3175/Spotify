import React from 'react';
import MuiSlider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

// Component SliderBar (thanh tiến trình)
const SliderBar = styled('div')<{ value: number }>(({ value }) => ({
  position: 'absolute',
  borderRadius: 4,
  top: 0,
  bottom: 0,
  left: 0,
  width: `${value * 100}%`,
  backgroundColor: 'currentColor',
}));

// Component SliderHandle (nút kéo)
const SliderHandle = styled('div')<{ value: number }>(({ value }) => ({
  position: 'absolute', // Sửa lỗi cú pháp
  width: 10,
  height: 10,
  borderRadius: '100%',
  backgroundColor: 'currentColor',
  top: 0,
  left: `${value * 100}%`,
  marginTop: -3,
  marginLeft: -8,
  transform: 'scale(1)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.3)',
  },
}));

// Component chính
export const Slider = ({
  isEnabled = true,
  value,
  onChange,
  onChangeStart,
  onChangeEnd,
  style,
  className = 'volume-sider-container',
}: {
  isEnabled?: boolean;
  value: number;
  onChange: (value: number) => void;
  onChangeStart?: () => void;
  onChangeEnd?: (value: number) => void;
  style?: React.CSSProperties;
  className?: string;
}) => {
  const handleChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) return; // Chỉ xử lý single value
    onChange(newValue);
  };

  const handleChangeCommitted = (event: React.SyntheticEvent | Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) return;
    onChangeEnd?.(newValue);
  };

  return (
    <div className={className} style={style}>
      <MuiSlider
        disabled={!isEnabled}
        value={value * 100} // MUI Slider dùng scale 0-100
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
        onMouseDown={onChangeStart}
        sx={{
          height: 4,
          padding: '13px 0',
          '& .MuiSlider-rail': {
            opacity: 0.3,
            backgroundColor: 'grey',
          },
          '& .MuiSlider-track': {
            display: 'none',
          },
          '& .MuiSlider-thumb': {
            display: 'none',
          },
        }}
        className="volume-sider"
      />
      <SliderBar value={value} />
      <SliderHandle value={value} />
    </div>
  );
};